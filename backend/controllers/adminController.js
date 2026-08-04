const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getAdminStats = async (req, res) => {
  try {
    let dbOrders = [];
    let dbProducts = [];
    let dbUsersCount = 0;

    // Fetch Real Database Data from MongoDB
    try {
      dbOrders = await Order.find({});
      dbProducts = await Product.find({});
      dbUsersCount = await User.countDocuments({});
    } catch (dbErr) {
      console.warn('MongoDB query for admin stats:', dbErr.message);
    }

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
      totalCustomers: dbUsersCount,
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
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdminStats, getAdminUsers };
