const { parseAIIntent } = require('../services/aiService');
const Product = require('../models/Product');
const { sampleProducts } = require('../utils/seedData');

const processAIQuery = async (req, res) => {
  try {
    const { message, context, products, orders } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Always fetch latest products from MongoDB database to reflect real-time catalog changes & admin updates
    let availableProducts = [];
    try {
      const dbProducts = await Product.find().sort({ createdAt: -1 });
      if (dbProducts && dbProducts.length > 0) {
        availableProducts = dbProducts.map((p) => p.toObject());
      }
    } catch (err) {
      console.warn('Database query fallback in AI controller:', err.message);
    }

    // Combine request products, database products, and sample products
    if (availableProducts.length === 0) {
      if (products && products.length > 0) {
        availableProducts = products;
      } else {
        availableProducts = sampleProducts;
      }
    }

    const availableOrders = orders || [];

    const aiResult = await parseAIIntent({
      message,
      context: context || {},
      products: availableProducts,
      orders: availableOrders,
    });

    res.json({
      success: true,
      text: aiResult.text,
      action: aiResult.action,
      products: aiResult.products || [],
      compareData: aiResult.compareData || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { processAIQuery };
