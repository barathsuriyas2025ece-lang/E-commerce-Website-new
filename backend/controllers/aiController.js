const { parseAIIntent } = require('../services/aiService');
const { sampleProducts } = require('../utils/seedData');

const processAIQuery = async (req, res) => {
  try {
    const { message, context, products, orders } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const availableProducts = products && products.length > 0 ? products : sampleProducts;
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
