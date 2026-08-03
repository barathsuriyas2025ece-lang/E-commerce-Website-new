import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Bot, MessageSquare, Edit2, Trash2, CheckCircle2, LogIn, Send } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addOrUpdateReview, deleteReview } = useProducts();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setIsAiOpen, sendMessage } = useAI();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const currentUserId = user?.id || user?._id || '';
  const reviewsList = product?.reviews || [
    {
      _id: 'sample_rev_1',
      user: 'user_sample_1',
      userName: 'Suriya S.',
      rating: 5,
      comment: 'Exceptional quality and performance! Exceeded my expectations in speed and battery life.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'sample_rev_2',
      user: 'user_sample_2',
      userName: 'Priya R.',
      rating: 4,
      comment: 'Very sleek design and fast delivery. Highly recommended for daily productivity!',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  // Pre-fill form if user has an existing review
  const existingReview = currentUserId
    ? reviewsList.find((r) => r.user && r.user.toString() === currentUserId.toString())
    : null;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [existingReview, id]);

  if (!product) {
    return (
      <div className="glass-panel p-12 text-center text-slate-700 space-y-4 max-w-md mx-auto my-12 bg-white border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2.5 px-6 rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer">Back to Shop</button>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id || product.id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    await addOrUpdateReview(product._id || product.id, {
      rating,
      comment: comment.trim(),
      user,
    });
    setSubmitting(false);
    setSuccessMsg(existingReview ? 'Your review was updated successfully!' : 'Thank you! Your review has been posted.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await deleteReview(product._id || product.id, reviewId);
      setComment('');
      setRating(5);
      setSuccessMsg('Your review has been removed.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Calculate Star Rating Breakdown
  const totalReviewsCount = reviewsList.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Details & Buying Controls */}
        <div className="space-y-6">
          <div>
            <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">{product.category}</span>
            <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold ml-1 text-slate-900">{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-slate-500">({totalReviewsCount} Customer Reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="badge badge-stock">In Stock ({product.stock || 10} units)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700">Quantity:</label>
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-700 hover:bg-slate-200 rounded-l-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-slate-700 hover:bg-slate-200 rounded-r-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-8 text-sm flex-1 justify-center rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-white shrink-0" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full border transition ${
                  isLiked ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-200 hover:text-pink-600 shadow-sm'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Ask AI about this product */}
          <button
            onClick={() => {
              setIsAiOpen(true);
              sendMessage(`What are the key advantages and alternative recommendations for ${product.name}?`, [product]);
            }}
            className="w-full glass-panel p-3.5 rounded-xl border-indigo-200 text-indigo-700 bg-indigo-50/50 flex items-center justify-center gap-2 text-xs font-bold hover:bg-indigo-100/50 transition"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Ask AI Assistant about this product's features</span>
          </button>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <div className="space-y-8 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <span>Customer Ratings & Reviews</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Real ratings and verified feedback from genuine customers</p>
          </div>
        </div>

        {/* Rating Breakdown & Review Submission Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Rating Score Breakdown */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1 pb-4 border-b border-slate-100">
              <div className="text-4xl font-extrabold text-slate-900">{product.rating || 4.8}</div>
              <div className="flex justify-center text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${s <= Math.round(product.rating || 5) ? 'fill-current text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-semibold">{totalReviewsCount} Total Reviews</p>
            </div>

            {/* Star Distribution Bars */}
            <div className="space-y-2 text-xs">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = ratingCounts[starNum] || 0;
                const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <div key={starNum} className="flex items-center gap-2">
                    <span className="w-12 text-slate-600 font-bold flex items-center gap-1">
                      {starNum} <Star className="w-3 h-3 fill-current text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      ></div>
                    </div>
                    <span className="w-8 text-right text-slate-400 font-medium text-[11px]">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (2 cols wide): Write / Edit Review Form */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>{existingReview ? 'Edit Your Customer Review' : 'Write a Customer Review'}</span>
              {existingReview && (
                <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Previously Reviewed
                </span>
              )}
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Interactive Star Rating Selector */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Select Your Rating:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <button
                        type="button"
                        key={starIndex}
                        onMouseEnter={() => setHoverRating(starIndex)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starIndex)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            starIndex <= (hoverRating || rating)
                              ? 'fill-current text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-slate-600 font-extrabold text-sm">
                      {hoverRating || rating} out of 5
                    </span>
                  </div>
                </div>

                {/* Comment Text Area */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Your Review Comment:</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your experience, product quality, build design, performance, or recommendation for other shoppers..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2.5 px-6 text-xs rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{submitting ? 'Posting...' : existingReview ? 'Update Review' : 'Submit Review'}</span>
                  </button>

                  {existingReview && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(existingReview._id)}
                      className="btn-secondary bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 px-4 text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Delete My Review</span>
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <LogIn className="w-8 h-8 text-indigo-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Sign in to leave a rating and review</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Only signed-in customers can leave reviews to maintain genuine product ratings.
                </p>
                <Link to="/login" className="btn-primary text-xs py-2 px-6 inline-flex">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">User Reviews ({reviewsList.length})</h3>

          {reviewsList.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
              No reviews submitted yet for this product. Be the first to leave a review!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsList.map((rev) => {
                const isOwnReview = currentUserId && rev.user && rev.user.toString() === currentUserId.toString();
                return (
                  <div
                    key={rev._id || Math.random()}
                    className={`glass-panel p-5 rounded-2xl bg-white border space-y-3 transition shadow-sm ${
                      isOwnReview ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{rev.userName || 'Verified Buyer'}</span>
                            {isOwnReview && (
                              <span className="badge bg-indigo-100 text-indigo-800 text-[10px]">You</span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-400 gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current text-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {isOwnReview && (
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium pl-1">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
