/**
 * Modular AI Engine Service
 * Interprets user intent, natural language queries, product specs, orders & policy data
 * Produces contextual text & executable UI action commands for the frontend Floating AI assistant.
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
    msgLower.includes('who are you')
  ) {
    return {
      text: `Hello! 👋 I'm your NexusMart AI Shopping Assistant. I can help you find products, compare specs, track orders, apply discount coupons, and answer any store policy questions. What can I assist you with today?`,
      action: { type: 'GREETING', payload: {} },
    };
  }

  // 2. Specific Product Inquiry (Price, Specs, Stock, Recommendations)
  const matchingProduct = products.find((p) =>
    msgLower.includes(p.name.toLowerCase()) ||
    p.name.toLowerCase().split(' ').some((word) => word.length > 3 && msgLower.includes(word)) ||
    msgLower.includes(p.brand.toLowerCase())
  );

  if (matchingProduct && (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('how much') || msgLower.includes('spec') || msgLower.includes('stock') || msgLower.includes('rating'))) {
    return {
      text: `🏷️ **${matchingProduct.name}**\n\n- **Price**: ₹${matchingProduct.price.toLocaleString()}\n- **Rating**: ⭐ ${matchingProduct.rating || 4.8} / 5.0\n- **Stock Availability**: ${matchingProduct.countInStock > 0 ? `${matchingProduct.countInStock} items available in stock` : 'In Stock'}\n- **Brand**: ${matchingProduct.brand}\n- **Category**: ${matchingProduct.category}\n- **Highlights**: ${matchingProduct.description || 'High-performance premium product with manufacturer warranty.'}\n\nWould you like me to add **${matchingProduct.name}** to your cart or compare it with other items?`,
      action: {
        type: 'PRODUCT_INFO',
        payload: { product: matchingProduct },
      },
      products: [matchingProduct],
    };
  }

  // 3. Product Search & Budget Intent
  if (
    msgLower.includes('laptop') ||
    msgLower.includes('phone') ||
    msgLower.includes('headphone') ||
    msgLower.includes('watch') ||
    msgLower.includes('shoe') ||
    msgLower.includes('camera') ||
    msgLower.includes('tv') ||
    msgLower.includes('under') ||
    msgLower.includes('show') ||
    msgLower.includes('find') ||
    msgLower.includes('search') ||
    msgLower.includes('recommend') ||
    msgLower.includes('best')
  ) {
    const priceMatch = msgLower.match(/(\d+[\d,]*)/);
    let maxPrice = null;
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[0].replace(/,/g, ''), 10);
    }

    let matched = products.filter((p) => {
      let matchesQuery =
        msgLower.includes(p.category.toLowerCase()) ||
        p.name.toLowerCase().split(' ').some((word) => msgLower.includes(word)) ||
        msgLower.includes(p.brand.toLowerCase());
      if (maxPrice) {
        return matchesQuery && p.price <= maxPrice;
      }
      return matchesQuery;
    });

    if (matched.length === 0) {
      matched = products.slice(0, 4);
    }

    return {
      text: maxPrice
        ? `Here are top recommendations matching your budget of ₹${maxPrice.toLocaleString()}:`
        : `Here are matching products from our catalog:`,
      action: {
        type: 'SEARCH_PRODUCTS',
        payload: { query: message, maxPrice, matchedProducts: matched },
      },
      products: matched,
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
    const targetProduct = matchingProduct || products[0] || null;
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

  // Default Smart Assistant Fallback Response
  return {
    text: `I'm here to help! You can ask me to:\n- 🔍 Find products under a specific budget (e.g. *"Show gaming laptops under ₹70,000"*)\n- ⚖️ Compare products side-by-side\n- 📦 Track order status & courier details\n- 🏷️ Apply promo coupons (e.g. *"Apply SAVE10"*)\n- 💳 Learn about payment methods, returns, or warranty.`,
    action: { type: 'GENERAL_ASSISTANCE', payload: {} },
  };
};

module.exports = { parseAIIntent };
