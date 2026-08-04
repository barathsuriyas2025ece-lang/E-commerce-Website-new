const mongoose = require('mongoose');
const dns = require('dns');
const { sampleProducts, sampleCategories, sampleCoupons } = require('../utils/seedData');

// Resolve DNS TXT/SRV lookup issues (querySrv ECONNREFUSED / queryTxt ENOTFOUND) in Node.js for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
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
      console.log('🌱 Seeding initial products into MongoDB Atlas database...');
      await Product.insertMany(sampleProducts);
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories into MongoDB Atlas database...');
      await Category.insertMany(sampleCategories);
    }

    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding initial coupons into MongoDB Atlas database...');
      await Coupon.insertMany(sampleCoupons);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial Users into MongoDB Atlas database...');
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const userPassword = await bcrypt.hash('user123', salt);

      await User.insertMany([
        {
          name: 'System Administrator',
          email: 'barathsuriya.s2025ece@sece.ac.in',
          password: adminPassword,
          role: 'admin',
          loyaltyPoints: 1000,
          phone: '+91 9876543210',
          address: '123 Tech Park, Coimbatore, Tamil Nadu, 641001, India'
        },
        {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          password: userPassword,
          role: 'customer',
          loyaltyPoints: 250,
          phone: '+91 9123456789',
          address: '45 Green Street, Chennai, Tamil Nadu, 600001, India'
        },
        {
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          password: userPassword,
          role: 'customer',
          loyaltyPoints: 500,
          phone: '+91 9988776655',
          address: '78 MG Road, Bengaluru, Karnataka, 560001, India'
        }
      ]);
    }
    console.log('✅ MongoDB Atlas Seeder: Products, Categories, Coupons & Users indexed in cluster0.oxzely0.mongodb.net/nexusmart');
  } catch (err) {
    console.error('Error auto-seeding MongoDB Atlas data:', err.message);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://barathsuriyas2025ece_db_user:EOordu3mFwp9fOjw@cluster0.oxzely0.mongodb.net/nexusmart?retryWrites=true&w=majority';
  const localURI = 'mongodb://127.0.0.1:27017/nexusmart';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    isFallbackMode = false;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    await seedInitialDataIfEmpty();
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Warning: ${error.message}`);
    console.log('🔄 Attempting local MongoDB connection (mongodb://127.0.0.1:27017/nexusmart)...');

    try {
      const connLocal = await mongoose.connect(localURI, {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      isFallbackMode = false;
      console.log(`✅ Local MongoDB Connected: ${connLocal.connection.host}`);
      await seedInitialDataIfEmpty();
      return true;
    } catch (localErr) {
      console.error(`❌ Local MongoDB Connection Error: ${localErr.message}`);
      console.log('🚀 Defaulting to Intelligent In-Memory Storage Mode for seamless operation.');
      isFallbackMode = true;
      return false;
    }
  }
};

const getStatus = () => ({
  isConnected,
  isFallbackMode,
});

module.exports = { connectDB, getStatus, seedInitialDataIfEmpty };
