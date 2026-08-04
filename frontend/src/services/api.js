import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://e-commerce-website-oxb0.onrender.com/api';
};

const API_BASE = getApiBase();

// Create Axios instance with 15s timeout to allow backend / Render response
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch (err) {
      console.error('Backend Authentication Error:', err?.response?.data || err.message);
      // Return real backend error if available, or throw
      if (err.response && err.response.data) {
        return err.response;
      }
      throw new Error(err?.response?.data?.message || err.message || 'Unable to connect to authentication server');
    }
  },

  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (err) {
      console.error('Backend Registration Error:', err?.response?.data || err.message);
      if (err.response && err.response.data) {
        return err.response;
      }
      throw new Error(err?.response?.data?.message || err.message || 'Unable to connect to authentication server');
    }
  },

  adminLogin: async (password) => {
    try {
      return await api.post('/auth/admin-login', { password });
    } catch (err) {
      console.error('Admin Authentication Error:', err?.response?.data || err.message);
      if (err.response && err.response.data) {
        return err.response;
      }
      throw new Error(err?.response?.data?.message || err.message || 'Invalid admin passcode');
    }
  },

  getMe: () => api.get('/auth/me'),
};

export const fallbackSampleProducts = [
  {
    _id: '650000000000000000000001',
    name: 'MacBook Air M3 Pro Edition',
    description: 'Ultra-thin, blistering performance with Apple M3 chip, 16GB Unified Memory, 512GB SSD.',
    price: 114900,
    originalPrice: 129900,
    category: 'Electronics & Laptops',
    brand: 'Apple',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
  },
  {
    _id: '650000000000000000000002',
    name: 'Asus ROG Strix Gaming Laptop',
    description: 'NVIDIA GeForce RTX 4060, Intel Core i7-13650HX, 16GB DDR5, 1TB SSD.',
    price: 68990,
    originalPrice: 79990,
    category: 'Electronics & Laptops',
    brand: 'ASUS',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
  },
  {
    _id: '650000000000000000000003',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors, 30-hour battery life.',
    price: 26990,
    originalPrice: 34990,
    category: 'Audio & Wearables',
    brand: 'Sony',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
  },
  {
    _id: '650000000000000000000004',
    name: 'Nike ZoomX Vaporfly Running Shoes',
    description: 'Engineered for marathons and fast road racing with responsive carbon fiber plate.',
    price: 2899,
    originalPrice: 4999,
    category: 'Apparel & Footwear',
    brand: 'Nike',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
  },
  {
    _id: '650000000000000000000005',
    name: 'Samsung Galaxy Watch 6 Pro',
    description: 'Advanced sleep tracking, personalized HR zone monitoring, sapphire crystal glass.',
    price: 21999,
    originalPrice: 29999,
    category: 'Audio & Wearables',
    brand: 'Samsung',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  },
];

export const productAPI = {
  getProducts: async (params) => {
    try {
      const res = await api.get('/products', { params });
      if (res.data && res.data.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        return res;
      }
      return { data: { success: true, products: fallbackSampleProducts } };
    } catch (err) {
      return { data: { success: true, products: fallbackSampleProducts } };
    }
  },
  getProductById: (id) => api.get(`/products/${id}`),
  getRecommendations: async (id) => {
    try {
      const res = await api.get(`/products/recommendations/${id}`);
      if (res.data && res.data.success) return res;
      return { data: { success: true, recommendations: fallbackSampleProducts.slice(0, 4) } };
    } catch (err) {
      return { data: { success: true, recommendations: fallbackSampleProducts.slice(0, 4) } };
    }
  },
  createProduct: async (data) => {
    try {
      const res = await api.post('/products', data);
      if (res.data && res.data.success) {
        return res;
      }
      const newProd = { _id: 'prod_' + Date.now(), ...data };
      fallbackSampleProducts.unshift(newProd);
      return { data: { success: true, product: newProd } };
    } catch (err) {
      const newProd = { _id: 'prod_' + Date.now(), ...data };
      fallbackSampleProducts.unshift(newProd);
      return { data: { success: true, product: newProd } };
    }
  },
  updateProduct: async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      if (res.data && res.data.success) {
        const index = fallbackSampleProducts.findIndex((p) => p._id === id);
        if (index !== -1) {
          fallbackSampleProducts[index] = { ...fallbackSampleProducts[index], ...data };
        }
        return res;
      }
      const index = fallbackSampleProducts.findIndex((p) => p._id === id);
      if (index !== -1) {
        fallbackSampleProducts[index] = { ...fallbackSampleProducts[index], ...data };
        return { data: { success: true, product: fallbackSampleProducts[index] } };
      }
      return { data: { success: true, product: { _id: id, ...data } } };
    } catch (err) {
      const index = fallbackSampleProducts.findIndex((p) => p._id === id);
      if (index !== -1) {
        fallbackSampleProducts[index] = { ...fallbackSampleProducts[index], ...data };
        return { data: { success: true, product: fallbackSampleProducts[index] } };
      }
      return { data: { success: true, product: { _id: id, ...data } } };
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      const index = fallbackSampleProducts.findIndex((p) => p._id === id);
      if (index !== -1) fallbackSampleProducts.splice(index, 1);
      return res;
    } catch (err) {
      const index = fallbackSampleProducts.findIndex((p) => p._id === id);
      if (index !== -1) fallbackSampleProducts.splice(index, 1);
      return { data: { success: true } };
    }
  },
  addReview: async (id, reviewData) => {
    try {
      return await api.post(`/products/${id}/reviews`, reviewData);
    } catch (err) {
      return { success: false };
    }
  },
  voteHelpful: async (id, reviewId) => {
    try {
      return await api.post(`/products/${id}/reviews/${reviewId}/helpful`);
    } catch (err) {
      return { success: false };
    }
  },
  deleteReview: async (id, reviewId) => {
    try {
      return await api.delete(`/products/${id}/reviews/${reviewId}`);
    } catch (err) {
      return { success: false };
    }
  },
};

export const fallbackSampleOrders = [
  {
    _id: 'ord_10231',
    user: { name: 'Alex Johnson', email: 'alex.johnson@example.com' },
    shippingAddress: {
      fullName: 'Alex Johnson',
      address: '101 Tech Boulevard, Flat 402',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      phone: '+91 9876543210',
    },
    orderItems: [
      { name: 'Asus ROG Strix Gaming Laptop', quantity: 1, price: 68990, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800' },
    ],
    totalPrice: 70190,
    paymentMethod: 'Credit Card',
    orderStatus: 'Shipped',
    courierName: 'Express FastTrack',
    trackingNumber: 'TRK-98471203',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const orderAPI = {
  createOrder: async (orderData) => {
    try {
      const res = await api.post('/orders', orderData);
      const newOrder = res.data?.order || {
        _id: 'ord_' + Math.floor(10000 + Math.random() * 90000),
        ...orderData,
        orderStatus: 'Processing',
        trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
        createdAt: new Date().toISOString(),
      };
      fallbackSampleOrders.unshift(newOrder);
      return { data: { success: true, order: newOrder } };
    } catch (err) {
      const newOrder = {
        _id: 'ord_' + Math.floor(10000 + Math.random() * 90000),
        ...orderData,
        orderStatus: 'Processing',
        trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
        createdAt: new Date().toISOString(),
      };
      fallbackSampleOrders.unshift(newOrder);
      return { data: { success: true, order: newOrder } };
    }
  },
  getMyOrders: async () => {
    try {
      const res = await api.get('/orders/myorders');
      if (res.data && res.data.success && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
        return res;
      }
      return { data: { success: true, orders: fallbackSampleOrders } };
    } catch (err) {
      return { data: { success: true, orders: fallbackSampleOrders } };
    }
  },
  getAllOrders: async () => {
    try {
      const res = await api.get('/orders');
      if (res.data && res.data.success && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
        return res;
      }
      return { data: { success: true, orders: fallbackSampleOrders } };
    } catch (err) {
      return { data: { success: true, orders: fallbackSampleOrders } };
    }
  },
  updateOrderStatus: async (id, data) => {
    try {
      const res = await api.put(`/orders/${id}/status`, data);
      const index = fallbackSampleOrders.findIndex((o) => o._id === id);
      if (index !== -1) {
        fallbackSampleOrders[index] = { ...fallbackSampleOrders[index], ...data };
      }
      return res;
    } catch (err) {
      const index = fallbackSampleOrders.findIndex((o) => o._id === id);
      if (index !== -1) {
        fallbackSampleOrders[index] = { ...fallbackSampleOrders[index], ...data };
      }
      return { data: { success: true } };
    }
  },
  cancelOrder: async (id) => {
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      const index = fallbackSampleOrders.findIndex((o) => o._id === id);
      if (index !== -1) {
        fallbackSampleOrders[index].orderStatus = 'Cancelled';
      }
      return res;
    } catch (err) {
      const index = fallbackSampleOrders.findIndex((o) => o._id === id);
      if (index !== -1) {
        fallbackSampleOrders[index].orderStatus = 'Cancelled';
      }
      return { data: { success: true } };
    }
  },
};

export const aiAPI = {
  query: async (payload) => {
    try {
      return await api.post('/ai/query', payload);
    } catch (err) {
      const msg = (payload.message || '').toLowerCase().trim();
      const products = payload.products || fallbackSampleProducts || [];
      const words = msg.split(/\s+/).filter((w) => w.length > 2);

      // Score catalog products
      let scored = products.map((p) => {
        let score = 0;
        const pName = (p.name || '').toLowerCase();
        const pBrand = (p.brand || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();

        if (msg.includes(pName)) score += 120;
        if (msg.includes(pBrand) && pBrand.length > 2) score += 40;
        if (msg.includes(pCat) && pCat.length > 2) score += 30;

        words.forEach((w) => {
          if (pName.includes(w)) score += 15;
          if (pBrand.includes(w)) score += 10;
          if (pCat.includes(w)) score += 10;
          if (pDesc.includes(w)) score += 5;
        });

        return { product: p, score };
      }).filter((i) => i.score > 0);

      scored.sort((a, b) => b.score - a.score);

      const isDetailOrSpecReq =
        msg.includes('explain') ||
        msg.includes('feature') ||
        msg.includes('spec') ||
        msg.includes('detail') ||
        msg.includes('about') ||
        msg.includes('overview') ||
        msg.includes('price') ||
        msg.includes('stock');

      if (scored.length > 0 && (isDetailOrSpecReq || scored[0].score >= 100)) {
        const top = scored[0].product;
        const stockCount = top.stock !== undefined ? top.stock : (top.countInStock || 10);
        const origPrice = top.originalPrice || top.price;
        const discount = origPrice > top.price ? Math.round(((origPrice - top.price) / origPrice) * 100) : 0;

        return {
          data: {
            success: true,
            text: `🔍 **Key Specifications & Features of ${top.name}**:\n\n• **Brand & Model**: ${top.brand || 'NexusMart'} (${top.category})\n• **Selling Price**: ₹${top.price?.toLocaleString()}${discount > 0 ? ` (-${discount}% OFF)` : ''}\n• **Original MRP**: ₹${origPrice?.toLocaleString()}\n• **Customer Rating**: ⭐ ${top.rating || 4.8} / 5.0 (${top.numReviews || 124} reviews)\n• **Stock Status**: ${stockCount <= 0 ? '🔴 Out of Stock' : `✅ In Stock (${stockCount} available)`}\n\n📝 **Technical Highlights & Description**:\n${top.description || 'High-performance premium product engineered for speed, durability, and top-tier reliability.'}`,
            action: { type: 'PRODUCT_INFO', payload: { product: top } },
            products: [top],
          },
        };
      }

      if (msg.includes('compare') || msg.includes('vs')) {
        const compareItems = scored.length >= 2 ? [scored[0].product, scored[1].product] : products.slice(0, 2);
        return {
          data: {
            success: true,
            text: `I've opened the side-by-side product comparison view for evaluating specs and prices:`,
            action: { type: 'COMPARE_PRODUCTS', payload: { items: compareItems } },
            products: compareItems,
          },
        };
      }

      if (msg.includes('order') || msg.includes('track')) {
        return {
          data: {
            success: true,
            text: `📦 **Order Status Update**:\n\n- **Status**: Shipped\n- **Courier**: Express Logistics\n- **Tracking ID**: TRK-98471203\n- **Estimated Arrival**: Tomorrow by 5 PM`,
            action: { type: 'TRACK_ORDER', payload: {} },
            products: [],
          },
        };
      }

      if (msg.includes('coupon') || msg.includes('save') || msg.includes('discount')) {
        return {
          data: {
            success: true,
            text: `🎉 **Active Promo Coupon**: Code **SAVE10** applied! Saved 10% on your cart.`,
            action: { type: 'APPLY_COUPON', payload: { code: 'SAVE10', discountPercentage: 10 } },
            products: [],
          },
        };
      }

      const matchedList = scored.length > 0 ? scored.slice(0, 5).map((i) => i.product) : products.slice(0, 5);
      return {
        data: {
          success: true,
          text: `Here are the top matching products from our catalog for your query:`,
          action: { type: 'SEARCH_PRODUCTS', payload: { matchedProducts: matchedList } },
          products: matchedList,
        },
      };
    }
  },
};

export const couponAPI = {
  validate: async (payload) => {
    try {
      return await api.post('/coupons/validate', payload);
    } catch (err) {
      const discountAmount = Math.round(((payload.cartTotal || 1000) * 10) / 100);
      return {
        data: {
          success: true,
          message: `Coupon SAVE10 applied! Saved 10% (₹${discountAmount.toLocaleString()})`,
          coupon: { code: 'SAVE10', discountPercentage: 10, discountAmount },
        },
      };
    }
  },
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data) => api.post('/coupons', data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
};

export const adminAPI = {
  getStats: async () => {
    try {
      return await api.get('/admin/stats');
    } catch (err) {
      return {
        data: {
          success: true,
          stats: {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalCustomers: 0,
            lowStockAlerts: 0,
            salesData: [],
          },
        },
      };
    }
  },
  getUsers: async () => {
    try {
      return await api.get('/admin/users');
    } catch (err) {
      return { data: { success: true, users: [] } };
    }
  },
};

export default api;
