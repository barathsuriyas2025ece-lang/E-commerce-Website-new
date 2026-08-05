const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { memoryUsers } = require('./authController');

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

module.exports = { getAdminStats, getAdminUsers, getDeliverySettings, updateDeliverySettings };

