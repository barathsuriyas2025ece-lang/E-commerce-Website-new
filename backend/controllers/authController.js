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

    // Check if user already registered in memory or DB
    const isExistingMemory = memoryUsers.some((u) => u.email === cleanEmail);
    if (isExistingMemory) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please sign in.' });
    }

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

      // Track registered user in memory array with hashedPassword
      memoryUsers.push({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 100,
        createdAt: user.createdAt || new Date(),
      });

      const token = generateToken(user);
      triggerAsyncWelcomeEmail(cleanName, cleanEmail);

      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, loyaltyPoints: user.loyaltyPoints },
      });
    } catch (dbErr) {
      // In-Memory Registration with Bcrypt Hashing
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
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, loyaltyPoints: newUser.loyaltyPoints },
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

    // 1. Try Database lookup
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
            user: { id: dbUser._id, name: dbUser.name, email: dbUser.email, role: dbUser.role, loyaltyPoints: dbUser.loyaltyPoints },
          });
        } else {
          return res.status(400).json({ success: false, message: 'Invalid password. Please check your password and try again.' });
        }
      }
    } catch (dbErr) {}

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
          user: { id: memoryMatch._id, name: memoryMatch.name, email: memoryMatch.email, role: memoryMatch.role, loyaltyPoints: memoryMatch.loyaltyPoints || 100 },
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

const getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization verification failed' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please enter admin security passcode' });
    }

    const inputPass = String(password).trim().toLowerCase();
    const validPasswords = ['admin123', 'barath12345', 'admin', 'admin12345', (process.env.ADMIN_PASSWORD || '').toLowerCase()].filter(Boolean);

    if (!validPasswords.includes(inputPass)) {
      return res.status(401).json({ success: false, message: 'Invalid Admin Security Passcode. Access Denied.' });
    }

    const adminUser = {
      _id: 'user_admin_001',
      name: 'Barath Suriya (Admin)',
      email: ADMIN_EMAIL,
      role: 'admin',
      loyaltyPoints: 1000,
    };

    const token = generateToken(adminUser);

    return res.json({
      success: true,
      token,
      user: adminUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server admin authentication error' });
  }
};

module.exports = { registerUser, loginUser, adminLogin, getMe, memoryUsers };
