const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, getDeliverySettings, updateDeliverySettings } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);
router.get('/delivery-settings', getDeliverySettings);
router.post('/delivery-settings', protect, admin, updateDeliverySettings);

module.exports = router;

