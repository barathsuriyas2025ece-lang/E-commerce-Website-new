const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getAdminStats, getAdminUsers, createAdminUser, getAuditLogs, getDeliverySettings, updateDeliverySettings } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// 🛡️ Authenticated Admin Creation Rate Limiter (Max 5 admin creations per minute per Admin User)
const adminCreationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user?.id || req.user?._id || req.ip,
  message: { success: false, message: 'Too many admin creation requests. Please try again after 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);
router.post('/create-admin', protect, admin, adminCreationLimiter, createAdminUser);
router.get('/audit-logs', protect, admin, getAuditLogs);
router.get('/delivery-settings', getDeliverySettings);
router.post('/delivery-settings', protect, admin, updateDeliverySettings);

module.exports = router;

