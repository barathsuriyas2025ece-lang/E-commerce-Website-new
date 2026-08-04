const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);

module.exports = router;
