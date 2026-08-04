const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    loyaltyPoints: { type: Number, default: 100 },
    avatar: { type: String, default: '' },
    isVipSubscriber: { type: Boolean, default: false },
    vipPlan: { type: String, default: '' },
    vipExpiry: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

