const getAdminStats = async (req, res) => {
  try {
    const stats = {
      totalRevenue: 284950,
      totalOrders: 42,
      totalProducts: 18,
      totalCustomers: 156,
      lowStockAlerts: 3,
      salesData: [
        { month: 'Jan', revenue: 35000 },
        { month: 'Feb', revenue: 48000 },
        { month: 'Mar', revenue: 62000 },
        { month: 'Apr', revenue: 54000 },
        { month: 'May', revenue: 85950 },
      ],
      recentActivity: [
        { type: 'order', text: 'New Order #ord_10231 placed by Alex Johnson', time: '10 mins ago' },
        { type: 'product', text: 'Stock updated for Asus ROG Strix', time: '1 hour ago' },
        { type: 'user', text: 'New Customer account registered', time: '2 hours ago' },
      ],
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdminStats };
