const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin, getMe, updateProfile, updateVipStatus } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/vip', protect, updateVipStatus);

module.exports = router;
