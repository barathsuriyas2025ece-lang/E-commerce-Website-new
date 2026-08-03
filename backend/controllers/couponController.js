const { sampleCoupons } = require('../utils/seedData');

let memoryCoupons = [...sampleCoupons];

const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });

    const coupon = memoryCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (cartTotal && cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchaseAmount.toLocaleString()} required for this coupon`,
      });
    }

    const discountAmount = Math.min((cartTotal * coupon.discountPercentage) / 100, coupon.maxDiscountAmount || 5000);

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied! Saved ${coupon.discountPercentage}% (₹${discountAmount.toLocaleString()})`,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCoupons = async (req, res) => {
  res.json({ success: true, coupons: memoryCoupons });
};

module.exports = { validateCoupon, getCoupons };
