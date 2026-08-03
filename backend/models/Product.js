const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String, default: 'Generic' },
    stock: { type: Number, required: true, default: 10 },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    specifications: { type: Map, of: String },
    advantages: [{ type: String }],
    disadvantages: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
