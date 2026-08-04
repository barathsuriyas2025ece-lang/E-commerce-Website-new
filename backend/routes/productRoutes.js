const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getWeightedRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  voteHelpfulReview,
  deleteProductReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getProducts);
router.get('/recommendations/:id', getWeightedRecommendations);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/reviews/:reviewId/helpful', protect, voteHelpfulReview);
router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);

module.exports = router;
