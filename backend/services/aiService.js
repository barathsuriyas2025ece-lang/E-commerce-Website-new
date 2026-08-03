/**
 * Modular AI Engine Service
 * Interprets user intent, natural language queries, product specs, orders & policy data
 * Produces contextual text & executable UI action commands for the frontend Floating AI assistant.
 */

const parseAIIntent = async ({ message, context, products = [], orders = [] }) => {
  const msgLower = message.toLowerCase().trim();

  // Action 1: Search products by price / keyword
  if (
    msgLower.includes('laptop') ||
    msgLower.includes('phone') ||
    msgLower.includes('shoe') ||
    msgLower.includes('watch') ||
    msgLower.includes('under') ||
    msgLower.includes('show') ||
    msgLower.includes('find') ||
    msgLower.includes('search')
  ) {
    // Extract price number if present
    const priceMatch = msgLower.match(/(\d+[\d,]*)/);
    let maxPrice = null;
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[0].replace(/,/g, ''), 10);
    }

    // Filter products
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

  // Action 2: Product Comparison
  if (
    msgLower.includes('compare') ||
    msgLower.includes('vs') ||
    msgLower.includes('difference between')
  ) {
    let itemsToCompare = products.slice(0, 2);
    return {
      text: `I've opened the interactive product comparison view for you to evaluate price, specs, advantages, and ratings side-by-side:`,
      action: {
        type: 'COMPARE_PRODUCTS',
        payload: { items: itemsToCompare },
      },
      compareData: itemsToCompare,
    };
  }

  // Action 3: Add to Cart
  if (
    msgLower.includes('add to cart') ||
    msgLower.includes('buy first') ||
    msgLower.includes('add first')
  ) {
    const targetProduct = products[0] || null;
    return {
      text: targetProduct
        ? `I have added **${targetProduct.name}** (₹${targetProduct.price.toLocaleString()}) directly to your cart!`
        : `Added item to your cart!`,
      action: {
        type: 'ADD_TO_CART',
        payload: { product: targetProduct },
      },
    };
  }

  // Action 4: Checkout Navigation
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

  // Action 5: Track Order
  if (
    msgLower.includes('order') ||
    msgLower.includes('track') ||
    msgLower.includes('where is my package') ||
    msgLower.includes('delivery status')
  ) {
    const latestOrder = orders[0] || {
      _id: '10231',
      orderStatus: 'Shipped',
      courierName: 'Express Logistics',
      trackingNumber: 'TRK-98471203',
      estimatedDelivery: 'Tomorrow by 5 PM',
      totalPrice: 45999,
    };

    return {
      text: `📦 **Order Status update for Order #${latestOrder._id.toString().slice(-5)}**:\n\n- **Status**: ${latestOrder.orderStatus}\n- **Courier**: ${latestOrder.courierName}\n- **Tracking ID**: ${latestOrder.trackingNumber}\n- **Estimated Arrival**: ${latestOrder.estimatedDelivery}`,
      action: {
        type: 'TRACK_ORDER',
        payload: { order: latestOrder },
      },
    };
  }

  // Action 6: Coupon Assistance
  if (
    msgLower.includes('coupon') ||
    msgLower.includes('discount') ||
    msgLower.includes('promo') ||
    msgLower.includes('offer')
  ) {
    return {
      text: `🎉 Active Promo Codes Available Today:\n\n1. **SAVE10** - 10% Instant Discount on orders over ₹1,000.\n2. **WELCOME20** - 20% Off for new customers.\n\nWould you like me to auto-apply **SAVE10** to your cart?`,
      action: {
        type: 'APPLY_COUPON',
        payload: { code: 'SAVE10', discountPercentage: 10 },
      },
    };
  }

  // Action 7: Return & Support FAQ
  if (
    msgLower.includes('return') ||
    msgLower.includes('refund') ||
    msgLower.includes('policy') ||
    msgLower.includes('warranty')
  ) {
    return {
      text: `🛡️ **Store Policy & Support Info**:\n\n- **Returns**: 30-day hassle-free doorstep returns and full refund.\n- **Warranty**: All electronic items come with a 1-Year Official Brand Warranty.\n- **Shipping**: Free Express Delivery on orders above ₹999.`,
      action: { type: 'FAQ_RESPONSE', payload: {} },
    };
  }

  // Default AI Shopping Advice Response
  return {
    text: `I'm your personal AI Shopping Assistant! I can help you search items by budget, compare products, track orders, apply promo coupons, and manage your shopping cart. What are you looking to buy today?`,
    action: { type: 'GENERAL_ASSISTANCE', payload: {} },
  };
};

module.exports = { parseAIIntent };
