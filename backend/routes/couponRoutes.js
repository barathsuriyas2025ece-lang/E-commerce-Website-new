const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons } = require('../controllers/couponController');

router.post('/validate', validateCoupon);
router.get('/', getCoupons);

module.exports = router;
