const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendLoginNotificationEmail, sendWelcomeEmail } = require('../notifications/emailService');

const ADMIN_EMAIL = 'barathsuriya.s2025ece@sece.ac.in';

// Pre-register Admin user in memory store with hashed password
let memoryUsers = [
  {
    _id: 'user_admin_001',
    name: 'Barath Suriya (Admin)',
    email: ADMIN_EMAIL,
    password: bcrypt.hashSync('barath12345', 10),
    role: 'admin',
    loyaltyPoints: 1000,
    createdAt: new Date(),
  },
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'super_secret_jwt_key_replace_in_production',
    { expiresIn: '30d' }
  );
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[$\{\}]/g, '').trim();
};

const validateEmailFormat = (emailStr) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(emailStr).toLowerCase().trim());
};

const triggerAsyncWelcomeEmail = (name, email) => {
  setImmediate(() => {
    sendWelcomeEmail({ name, email }).catch((err) => {
      console.error('[EMAIL ERROR]', err?.message || err);
    });
  });
};

const triggerAsyncLoginEmail = (name, email, req) => {
  const userAgent = req.headers['user-agent'] || '';
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress || '';
  
  setImmediate(() => {
    sendLoginNotificationEmail({ name, email, userAgent, clientIp }).catch((err) => {
      console.error('[EMAIL ERROR]', err?.message || err);
    });
  });
};

const { ensureConnectedDB } = require('../config/db');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanName = sanitizeInput(name);

    if (!validateEmailFormat(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address format (e.g. name@example.com)' });
    }

    if (password.length < 5) {
      return res.status(400).json({ success: false, message: 'Password must be at least 5 characters long' });
    }

    // Ensure MongoDB connection is active
    await ensureConnectedDB();

    try {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please sign in.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: role === 'admin' && cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer',
      });

      // Mirror registered user in memory array for speed
      const memUser = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 100,
        createdAt: user.createdAt || new Date(),
      };
      memoryUsers.push(memUser);

      const token = generateToken(user);
      triggerAsyncWelcomeEmail(cleanName, cleanEmail);

      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role, loyaltyPoints: user.loyaltyPoints },
      });
    } catch (dbErr) {
      console.error('[DATABASE REGISTER ERROR]', dbErr.message);

      // Fallback in-memory registration if DB is completely unreachable
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer',
        loyaltyPoints: 100,
        createdAt: new Date(),
      };

      memoryUsers.push(newUser);

      const token = generateToken(newUser);
      triggerAsyncWelcomeEmail(cleanName, cleanEmail);

      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser._id, _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, loyaltyPoints: newUser.loyaltyPoints },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server registration error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both registered email and password' });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();

    if (!validateEmailFormat(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address format' });
    }

    // Ensure MongoDB connection is active
    await ensureConnectedDB();

    // 1. Try Database lookup first
    try {
      const dbUser = await User.findOne({ email: cleanEmail });
      if (dbUser) {
        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (isMatch) {
          const token = generateToken(dbUser);
          triggerAsyncLoginEmail(dbUser.name, dbUser.email, req);

          return res.json({
            success: true,
            token,
            user: {
              id: dbUser._id,
              _id: dbUser._id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
              loyaltyPoints: dbUser.loyaltyPoints || 100,
              isVipSubscriber: Boolean(dbUser.isVipSubscriber),
              vipPlan: dbUser.vipPlan || '',
              vipExpiry: dbUser.vipExpiry || '',
              phone: dbUser.phone || '',
              address: dbUser.address || '',
            },
          });
        } else {
          return res.status(400).json({ success: false, message: 'Invalid password. Please check your password and try again.' });
        }
      }
    } catch (dbErr) {
      console.error('[DATABASE LOGIN ERROR]', dbErr.message);
    }

    // 2. Try Memory lookup for registered users
    const memoryMatch = memoryUsers.find((u) => u.email === cleanEmail);
    if (memoryMatch) {
      let isMatch = false;
      if (memoryMatch.password.startsWith('$2a$') || memoryMatch.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, memoryMatch.password);
      } else {
        isMatch = password === memoryMatch.password;
      }

      if (isMatch) {
        const token = generateToken(memoryMatch);
        triggerAsyncLoginEmail(memoryMatch.name, memoryMatch.email, req);

        return res.json({
          success: true,
          token,
          user: {
            id: memoryMatch._id,
            _id: memoryMatch._id,
            name: memoryMatch.name,
            email: memoryMatch.email,
            role: memoryMatch.role,
            loyaltyPoints: memoryMatch.loyaltyPoints || 100,
            isVipSubscriber: Boolean(memoryMatch.isVipSubscriber),
            vipPlan: memoryMatch.vipPlan || '',
            vipExpiry: memoryMatch.vipExpiry || '',
            phone: memoryMatch.phone || '',
            address: memoryMatch.address || '',
          },
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid password. Please check your password and try again.' });
      }
    }

    // 3. User email is not registered in system
    return res.status(400).json({
      success: false,
      message: 'Account not found. Please register your account first before signing in.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server authentication error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User identification missing.' });
    }

    const { name, email, phone, address } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Full name is required (minimum 2 characters).' });
    }

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPhone = sanitizeInput(phone || '');
    const cleanAddress = sanitizeInput(address || '');

    if (!validateEmailFormat(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address format.' });
    }

    // 1. Check duplicate email ownership across other accounts (HTTP 409 Conflict)
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const emailOwner = await User.findOne({ email: cleanEmail, _id: { $ne: userId } });
        if (emailOwner) {
          return res.status(409).json({ success: false, message: 'An account with this email address already exists. Please choose a different email.' });
        }
      }
    } catch (dbCheckErr) {}

    // 2. Perform MongoDB Update
    let updatedUser = null;
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            address: cleanAddress,
          },
          { new: true, runValidators: true }
        ).select('-password');
      }
    } catch (dbErr) {
      console.error('[ENDPOINT ERROR]', {
        endpoint: req.originalUrl,
        user: userId,
        error: dbErr.message,
        stack: dbErr.stack,
      });
    }

    // 3. Fallback / Sync Memory User
    const memIdx = memoryUsers.findIndex((u) => (u._id || u.id).toString() === userId.toString());
    if (memIdx !== -1) {
      memoryUsers[memIdx] = {
        ...memoryUsers[memIdx],
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
      };
      if (!updatedUser) updatedUser = memoryUsers[memIdx];
    }

    if (!updatedUser) {
      updatedUser = {
        _id: userId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        role: req.user?.role || 'customer',
      };
    }

    // 4. Issue Refreshed JWT Token so frontend updates credentials without relogging
    const token = generateToken(updatedUser);

    return res.json({
      success: true,
      message: 'Profile details updated successfully',
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        loyaltyPoints: updatedUser.loyaltyPoints || 100,
        isVipSubscriber: Boolean(updatedUser.isVipSubscriber),
        vipPlan: updatedUser.vipPlan || '',
        vipExpiry: updatedUser.vipExpiry || '',
      },
      token,
    });
  } catch (error) {
    console.error('[ENDPOINT ERROR]', {
      endpoint: req.originalUrl,
      user: req.user?.id || req.user?._id,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

const updateVipStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User identification missing.' });
    }

    const { vipPlan, durationDays } = req.body;
    const allowedPlans = ['VIP Monthly Pass', 'VIP Pro Annual', 'VIP Gold Quarter'];
    const chosenPlan = allowedPlans.includes(vipPlan) ? vipPlan : 'VIP Pro Annual';
    const days = Number(durationDays) || (chosenPlan === 'VIP Pro Annual' ? 365 : chosenPlan === 'VIP Gold Quarter' ? 90 : 30);

    const vipExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString();

    let updatedUser = null;
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            isVipSubscriber: true,
            vipPlan: chosenPlan,
            vipExpiry: vipExpiryDate,
          },
          { new: true, runValidators: true }
        ).select('-password');
      }
    } catch (dbErr) {
      console.error('[ENDPOINT ERROR]', {
        endpoint: req.originalUrl,
        user: userId,
        error: dbErr.message,
        stack: dbErr.stack,
      });
    }

    const memIdx = memoryUsers.findIndex((u) => (u._id || u.id).toString() === userId.toString());
    if (memIdx !== -1) {
      memoryUsers[memIdx].isVipSubscriber = true;
      memoryUsers[memIdx].vipPlan = chosenPlan;
      memoryUsers[memIdx].vipExpiry = vipExpiryDate;
      if (!updatedUser) updatedUser = memoryUsers[memIdx];
    }

    if (!updatedUser) {
      updatedUser = {
        ...req.user,
        isVipSubscriber: true,
        vipPlan: chosenPlan,
        vipExpiry: vipExpiryDate,
      };
    }

    const token = generateToken(updatedUser);

    return res.json({
      success: true,
      message: `🎉 VIP Subscription active: ${chosenPlan}`,
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        role: updatedUser.role,
        loyaltyPoints: updatedUser.loyaltyPoints || 100,
        isVipSubscriber: true,
        vipPlan: chosenPlan,
        vipExpiry: vipExpiryDate,
      },
      token,
    });
  } catch (error) {
    console.error('[ENDPOINT ERROR]', {
      endpoint: req.originalUrl,
      user: req.user?.id || req.user?._id,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: 'Server error activating VIP subscription' });
  }
};

module.exports = { registerUser, loginUser, adminLogin, getMe, updateProfile, updateVipStatus, memoryUsers };

