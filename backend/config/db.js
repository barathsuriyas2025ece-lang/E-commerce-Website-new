const mongoose = require('mongoose');
const dns = require('dns');
const { sampleProducts, sampleCategories, sampleCoupons } = require('../utils/seedData');

// Resolve DNS TXT lookup issues (queryTxt ENOTFOUND / EDESTRUCTION) in Node.js for MongoDB Atlas
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

let isConnected = false;
let isFallbackMode = false;

const seedInitialDataIfEmpty = async () => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const Coupon = require('../models/Coupon');
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products into MongoDB database...');
      await Product.insertMany(sampleProducts);
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories into MongoDB database...');
      await Category.insertMany(sampleCategories);
    }

    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding initial coupons into MongoDB database...');
      await Coupon.insertMany(sampleCoupons);
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('🌱 Creating default Admin user in MongoDB database...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'System Administrator',
        email: 'barathsuriya.s2025ece@sece.ac.in',
        password: hashedPassword,
        role: 'admin',
        loyaltyPoints: 1000,
      });
    }
    console.log('✅ MongoDB Seeder: Products, Categories, Coupons & Admin User indexed in database nexusmart');
  } catch (err) {
    console.error('Error auto-seeding MongoDB data:', err.message);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexusmart';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas / Local Connected: ${conn.connection.host}`);
    await seedInitialDataIfEmpty();
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('🚀 Defaulting to Intelligent In-Memory Storage Mode for seamless operation.');
    isFallbackMode = true;
    return false;
  }
};

const getStatus = () => ({
  isConnected,
  isFallbackMode,
});

module.exports = { connectDB, getStatus, seedInitialDataIfEmpty };
