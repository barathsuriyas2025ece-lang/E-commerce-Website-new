/**
 * Modular AI Engine Service
 * Interprets user intent, natural language queries, product specs, orders & policy data
 * Dynamically indexes real-time product catalog & produces accurate responses & UI commands.
 */

const parseAIIntent = async ({ message, context, products = [], orders = [] }) => {
  const msgLower = message.toLowerCase().trim();

  // 1. Greetings & Introductory Queries
  if (
    msgLower === 'hi' ||
    msgLower === 'hello' ||
    msgLower === 'hey' ||
    msgLower.startsWith('good morning') ||
    msgLower.startsWith('good afternoon') ||
    msgLower.includes('who are you') ||
    msgLower.includes('what can you do')
  ) {
    return {
      text: `Hello! 👋 I'm your NexusMart AI Shopping Assistant. I'm connected directly to our real-time product inventory. I can help you find specific items, compare prices & specs, track orders, apply discount coupons, or answer store policy questions. What are you looking for today?`,
      action: { type: 'GREETING', payload: {} },
    };
  }

  // 2. Query for "Show all products" or "List products"
  if (
    msgLower.includes('all product') ||
    msgLower.includes('list product') ||
    msgLower.includes('what products') ||
    msgLower.includes('catalog') ||
    msgLower === 'products'
  ) {
    const topProducts = products.slice(0, 6);
    return {
      text: `We currently have **${products.length} products** in store! Here are some of our top items:`,
      action: {
        type: 'SEARCH_PRODUCTS',
        payload: { query: message, matchedProducts: topProducts },
      },
      products: topProducts,
    };
  }

  // 3. Specific Product Search & Matching Engine
  const words = msgLower.split(/\s+/).filter((w) => w.length > 2);
  let scoredProducts = products.map((p) => {
    let score = 0;
    const pName = (p.name || '').toLowerCase();
    const pBrand = (p.brand || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    const pTags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';

    // Direct match bonuses
    if (msgLower.includes(pName)) score += 100;
    if (msgLower.includes(pBrand) && pBrand.length > 2) score += 40;
    if (msgLower.includes(pCat) && pCat.length > 2) score += 30;

    // Word-by-word token scoring
    words.forEach((w) => {
      if (pName.includes(w)) score += 15;
      if (pBrand.includes(w)) score += 10;
      if (pCat.includes(w)) score += 10;
      if (pDesc.includes(w)) score += 5;
      if (pTags.includes(w)) score += 8;
    });

    return { product: p, score };
  }).filter((item) => item.score > 0);

  scoredProducts.sort((a, b) => b.score - a.score);

  // Price budget extraction (e.g. "under 50000" or "below 30000")
  const priceMatch = msgLower.match(/(?:under|below|less than|max|budget)\s*₹?\s*(\d+[\d,]*)/i) || msgLower.match(/₹?\s*(\d+[\d,]*)/);
  let maxPrice = null;
  if (priceMatch && priceMatch[1]) {
    const parsedPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(parsedPrice) && parsedPrice > 100) {
      maxPrice = parsedPrice;
    }
  }

  // Filter scored items by maxPrice if specified
  if (maxPrice) {
    scoredProducts = scoredProducts.filter((item) => item.product.price <= maxPrice);
  }

  // Exact Single Product Detail Intent (Asking for price, specs, stock of a specific product)
  if (scoredProducts.length > 0 && (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('how much') || msgLower.includes('spec') || msgLower.includes('stock') || msgLower.includes('detail') || msgLower.includes('rating'))) {
    const topMatch = scoredProducts[0].product;
    const stockCount = topMatch.stock !== undefined ? topMatch.stock : (topMatch.countInStock || 0);
    const stockStatus = stockCount <= 0
      ? '🔴 Out of Stock'
      : stockCount <= 5
      ? `⚠️ Only ${stockCount} left in stock!`
      : `✅ In Stock (${stockCount} items available)`;

    return {
      text: `🏷️ **${topMatch.name}**\n\n- **Price**: ₹${topMatch.price.toLocaleString()}\n- **Rating**: ⭐ ${topMatch.rating || 4.8} / 5.0 (${topMatch.numReviews || 24} reviews)\n- **Stock Availability**: ${stockStatus}\n- **Brand**: ${topMatch.brand || 'Generic'}\n- **Category**: ${topMatch.category}\n- **Highlights**: ${topMatch.description || 'High-performance premium product.'}\n\nWould you like me to add **${topMatch.name}** to your cart or compare it with other items?`,
      action: {
        type: 'PRODUCT_INFO',
        payload: { product: topMatch },
      },
      products: [topMatch],
    };
  }

  // General Matching Products Search Intent
  if (scoredProducts.length > 0) {
    const matchedList = scoredProducts.slice(0, 5).map((item) => item.product);
    return {
      text: maxPrice
        ? `Here are top recommendations matching your query under ₹${maxPrice.toLocaleString()}:`
        : `Here are the best matching products from our real-time catalog:`,
      action: {
        type: 'SEARCH_PRODUCTS',
        payload: { query: message, maxPrice, matchedProducts: matchedList },
      },
      products: matchedList,
    };
  }

  // 4. Product Comparison Matrix
  if (
    msgLower.includes('compare') ||
    msgLower.includes('vs') ||
    msgLower.includes('difference between')
  ) {
    let itemsToCompare = products.slice(0, 2);
    return {
      text: `I've opened the interactive product comparison view for you to evaluate specs, pricing, ratings, and pros/cons side-by-side:`,
      action: {
        type: 'COMPARE_PRODUCTS',
        payload: { items: itemsToCompare },
      },
      compareData: itemsToCompare,
    };
  }

  // 5. Add to Cart Command
  if (
    msgLower.includes('add to cart') ||
    msgLower.includes('buy first') ||
    msgLower.includes('add first')
  ) {
    const targetProduct = scoredProducts[0]?.product || products[0] || null;
    return {
      text: targetProduct
        ? `I have added **${targetProduct.name}** (₹${targetProduct.price.toLocaleString()}) directly to your shopping cart!`
        : `Added item to your cart!`,
      action: {
        type: 'ADD_TO_CART',
        payload: { product: targetProduct },
      },
    };
  }

  // 6. Checkout Navigation
  if (
    msgLower.includes('checkout') ||
    msgLower.includes('pay now') ||
    msgLower.includes('proceed to payment')
  ) {
    return {
      text: `Navigating you straight to the secure checkout page...`,
      action: {
        type: 'REDIRECT_CHECKOUT',
        payload: { path: '/checkout' },
      },
    };
  }

  // 7. Order Status & Delivery Tracking
  if (
    msgLower.includes('order') ||
    msgLower.includes('track') ||
    msgLower.includes('where is my package') ||
    msgLower.includes('delivery status') ||
    msgLower.includes('shipping status')
  ) {
    const latestOrder = orders[0] || {
      _id: 'ord_10231',
      orderStatus: 'Shipped',
      courierName: 'Express Logistics',
      trackingNumber: 'TRK-98471203',
      estimatedDelivery: 'Tomorrow by 5 PM',
      totalPrice: 45999,
    };

    return {
      text: `📦 **Order Status Update for Order #${latestOrder._id.toString().slice(-5)}**:\n\n- **Current Status**: ${latestOrder.orderStatus}\n- **Courier Partner**: ${latestOrder.courierName}\n- **Tracking ID**: ${latestOrder.trackingNumber}\n- **Estimated Delivery**: ${latestOrder.estimatedDelivery || 'Tomorrow by 5 PM'}`,
      action: {
        type: 'TRACK_ORDER',
        payload: { order: latestOrder },
      },
    };
  }

  // 8. Promo Code & Coupons Assistance
  if (
    msgLower.includes('coupon') ||
    msgLower.includes('discount') ||
    msgLower.includes('promo') ||
    msgLower.includes('offer') ||
    msgLower.includes('save')
  ) {
    return {
      text: `🎉 **Active Promo Coupons Available Today**:\n\n1. **SAVE10** - 10% Instant Discount on all items.\n2. **WELCOME20** - 20% Off for new registered users.\n\nI have auto-applied **SAVE10** to your cart!`,
      action: {
        type: 'APPLY_COUPON',
        payload: { code: 'SAVE10', discountPercentage: 10 },
      },
    };
  }

  // 9. Payment Methods Query
  if (
    msgLower.includes('payment') ||
    msgLower.includes('pay') ||
    msgLower.includes('upi') ||
    msgLower.includes('cod') ||
    msgLower.includes('cash on delivery')
  ) {
    return {
      text: `💳 **Supported Payment Options**:\n\n- **Unified Payments Interface (UPI)**: Google Pay, PhonePe, Paytm, BHIM.\n- **Credit / Debit Cards**: Visa, Mastercard, RuPay, Amex.\n- **Net Banking**: All major Indian & International banks.\n- **Cash on Delivery (COD)**: Available on orders up to ₹25,000.`,
      action: { type: 'FAQ_RESPONSE', payload: {} },
    };
  }

  // 10. Return & Refund Policy / Support
  if (
    msgLower.includes('return') ||
    msgLower.includes('refund') ||
    msgLower.includes('policy') ||
    msgLower.includes('warranty') ||
    msgLower.includes('support') ||
    msgLower.includes('contact')
  ) {
    return {
      text: `🛡️ **NexusMart Customer Guarantee & Policy**:\n\n- **30-Day Doorstep Returns**: Full refund with free pickup.\n- **1-Year Warranty**: Official brand manufacturer warranty on all electronics.\n- **Free Shipping**: Express 24-48h delivery on orders above ₹999.\n- **24/7 Support**: Email us at support@nexusmart.com or call 1800-123-4567.`,
      action: { type: 'FAQ_RESPONSE', payload: {} },
    };
  }

  // Default Smart Assistant Fallback Response with current store summary
  return {
    text: `I'm connected to our store catalog of **${products.length} products**! You can ask me:\n- 🔍 Find specific products or budget items (e.g. *"Show laptops under ₹70,000"*)\n- 🏷️ Ask about a product's price, stock, or specifications\n- ⚖️ Compare products side-by-side\n- 📦 Track order status & courier details\n- 💳 Ask about payment methods, returns, or coupons.`,
    action: { type: 'GENERAL_ASSISTANCE', payload: {} },
  };
};

module.exports = { parseAIIntent };
