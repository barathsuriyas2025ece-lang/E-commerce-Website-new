const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');
const { memoryUsers } = require('./authController');

const createAuditLog = async ({ action, performedBy, target, ipAddress, userAgent, details }) => {
  try {
    await AuditLog.create({
      action,
      performedBy: {
        id: performedBy?.id || performedBy?._id || 'system',
        name: performedBy?.name || 'System Admin',
        email: performedBy?.email || '',
      },
      target: {
        id: target?.id || target?._id || '',
        email: target?.email || '',
      },
      ipAddress: ipAddress || '',
      userAgent: userAgent || '',
      details: details || {},
    });
  } catch (err) {
    console.error('[AUDIT LOG FAILED]', err.message);
  }
};

const getAdminStats = async (req, res) => {
  try {
    let dbOrders = [];
    let dbProducts = [];
    let dbUsers = [];

    // Fetch Real Database Data from MongoDB
    try {
      dbOrders = await Order.find({});
      dbProducts = await Product.find({});
      dbUsers = await User.find({}).select('-password');
    } catch (dbErr) {
      console.error('[DB READ FAILED] getAdminStats:', dbErr.message);
    }

    // Merge DB users with memoryUsers (deduplicate by email)
    const userMap = new Map();
    (dbUsers || []).forEach((u) => userMap.set(u.email.toLowerCase(), u));
    (memoryUsers || []).forEach((u) => {
      if (!userMap.has(u.email.toLowerCase())) {
        userMap.set(u.email.toLowerCase(), u);
      }
    });

    const totalCustomersCount = userMap.size;

    // Calculate Real Revenue (excluding Cancelled orders)
    const validOrders = dbOrders.filter((o) => (o.orderStatus || '').toLowerCase() !== 'cancelled');
    const totalRevenue = validOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const totalOrdersCount = dbOrders.length;
    const pendingOrdersCount = dbOrders.filter((o) =>
      ['pending', 'processing'].includes((o.orderStatus || '').toLowerCase())
    ).length;

    // Calculate Low Stock Alerts (Stock <= 5)
    const lowStockAlertsCount = dbProducts.filter((p) => (p.stock !== undefined ? p.stock : (p.countInStock || 10)) <= 5).length;

    // Monthly Sales Aggregation based strictly on real order timestamps
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const activeMonths = monthNames.slice(Math.max(0, currentMonthIdx - 4), currentMonthIdx + 1);

    const monthlyMap = {};
    activeMonths.forEach((m) => (monthlyMap[m] = 0));

    validOrders.forEach((o) => {
      const orderDate = o.createdAt ? new Date(o.createdAt) : new Date();
      const monthStr = monthNames[orderDate.getMonth()];
      if (monthlyMap[monthStr] !== undefined) {
        monthlyMap[monthStr] += (o.totalPrice || 0);
      }
    });

    const salesData = activeMonths.map((m) => ({
      month: m,
      revenue: monthlyMap[m] || 0,
    }));

    const stats = {
      totalRevenue,
      totalOrders: totalOrdersCount,
      pendingOrders: pendingOrdersCount,
      totalProducts: dbProducts.length,
      totalCustomers: totalCustomersCount,
      lowStockAlerts: lowStockAlertsCount,
      salesData,
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    let dbUsers = [];
    try {
      dbUsers = await User.find({}).select('-password');
    } catch (err) {
      console.error('[DB READ FAILED] getAdminUsers:', err.message);
    }

    const userMap = new Map();
    (dbUsers || []).forEach((u) => {
      if (u.email) userMap.set(u.email.toLowerCase(), u);
    });
    (memoryUsers || []).forEach((u) => {
      if (u.email && !userMap.has(u.email.toLowerCase())) {
        userMap.set(u.email.toLowerCase(), u);
      }
    });

    const users = Array.from(userMap.values());
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required admin details' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Password strength check for Admin: 8+ chars, uppercase, lowercase, number, special symbol
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+-=]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. Admin@123).',
      });
    }

    // Check duplicate in memory array
    const memoryExists = memoryUsers.some((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (memoryExists) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Check duplicate in DB
    try {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      }
    } catch (e) {
      console.warn('[DB CHECK WARNING]', e.message);
    }

    // High Security Hashing (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    let createdUser = null;
    try {
      createdUser = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: 'admin',
      });
    } catch (dbErr) {
      console.error('[DB WRITE FAILED] createAdminUser:', dbErr.message);
    }

    const memAdmin = {
      _id: createdUser ? createdUser._id.toString() : 'admin_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: 'admin',
      loyaltyPoints: 1000,
      createdAt: new Date(),
    };

    memoryUsers.push(memAdmin);

    // Audit Logging for CREATE_ADMIN
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    createAuditLog({
      action: 'CREATE_ADMIN',
      performedBy: req.user || { id: 'admin_sys', name: 'System Admin', email: '' },
      target: { id: memAdmin._id, email: cleanEmail },
      ipAddress: clientIp,
      userAgent: userAgent,
      details: { createdAdminName: cleanName },
    });

    const safeUserData = {
      id: memAdmin._id,
      _id: memAdmin._id,
      name: memAdmin.name,
      email: memAdmin.email,
      role: memAdmin.role,
      loyaltyPoints: memAdmin.loyaltyPoints,
    };

    return res.status(201).json({
      success: true,
      message: `Admin account '${cleanName}' created successfully`,
      data: safeUserData,
      user: safeUserData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin user: ' + error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const actionFilter = req.query.action || '';
    const search = req.query.search || '';

    const query = {};
    if (actionFilter) query.action = actionFilter;
    if (search) {
      query.$or = [
        { 'performedBy.name': { $regex: search, $options: 'i' } },
        { 'performedBy.email': { $regex: search, $options: 'i' } },
        { 'target.email': { $regex: search, $options: 'i' } },
      ];
    }

    let logs = [];
    let total = 0;

    try {
      total = await AuditLog.countDocuments(query);
      logs = await AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (err) {
      console.warn('[DB READ FAILED] getAuditLogs:', err.message);
    }

    res.json({
      success: true,
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

let deliverySettings = {
  isFreeDeliveryAll: true,
  freeShippingThreshold: 499,
  standardShippingFee: 49,
};

const getDeliverySettings = async (req, res) => {
  res.json({ success: true, settings: deliverySettings });
};

const updateDeliverySettings = async (req, res) => {
  try {
    const { isFreeDeliveryAll, freeShippingThreshold, standardShippingFee } = req.body;
    if (typeof isFreeDeliveryAll === 'boolean') deliverySettings.isFreeDeliveryAll = isFreeDeliveryAll;
    if (typeof freeShippingThreshold === 'number') deliverySettings.freeShippingThreshold = Number(freeShippingThreshold);
    if (typeof standardShippingFee === 'number') deliverySettings.standardShippingFee = Number(standardShippingFee);
    res.json({ success: true, message: 'Delivery policy updated successfully by Admin!', settings: deliverySettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAdminStats, getAdminUsers, createAdminUser, getAuditLogs, getDeliverySettings, updateDeliverySettings, createAuditLog };

