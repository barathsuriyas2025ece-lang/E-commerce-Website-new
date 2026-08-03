require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, getStatus } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express App
const app = express();

// Connect Database with Fallback Graceful Mode
connectDB();

// Security Header Middlewares (Protection against XSS, Clickjacking, MIME sniffing)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    xPoweredBy: false, // Prevents technology stack fingerprinting
  })
);

// CORS Protection
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Rate Limiting (Prevents Brute-Force & Denial of Service attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Strict Body Parsers (Prevents buffer overflow & payload flooding)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// RESTful API Endpoint Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

// Health Check & Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Enterprise MERN E-Commerce API with AI Assistant',
    dbStatus: getStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
