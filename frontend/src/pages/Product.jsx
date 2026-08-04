import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Bot, MessageSquare, Edit2, Trash2, CheckCircle2, LogIn, Send, ShieldCheck, Truck, RefreshCw, Award, Plus, Sparkles, ZoomIn } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import RecentlyViewed from '../components/RecentlyViewed';
import ImageLightboxModal from '../components/ImageLightboxModal';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addOrUpdateReview, deleteReview } = useProducts();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const product = getProductById(id);
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setIsAiOpen, sendMessage } = useAI();
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  const currentUserId = user?.id || user?._id || '';
  const reviewsList = product?.reviews || [];

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
        <button onClick={() => navigate('/shop')} className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer">Back to Shop</button>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id || product.id);
  const productImages = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];

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
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-3xl bg-white border border-slate-200 shadow-sm aspect-square overflow-hidden flex items-center justify-center relative group">
            <img
              src={productImages[selectedImageIdx] || productImages[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
            {/* Zoom Lightbox Trigger Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-6 right-6 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-lg transition opacity-0 group-hover:opacity-100 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Click to Zoom Fullscreen"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
          </div>

          <ImageLightboxModal
            images={productImages}
            selectedIdx={selectedImageIdx}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            onSelectIdx={setSelectedImageIdx}
          />

          {/* Thumbnail Selectors */}
          {productImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition cursor-pointer ${
                    selectedImageIdx === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {product.brand || product.category || 'NexusMart'}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Star className="w-4 h-4 fill-current mr-1 text-amber-400" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">({totalReviewsCount} Verified Reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">Model: #{product._id?.slice(-6) || 'NX-901'}</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Inclusive of all taxes. Free express shipping applied at checkout.</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{product.description}</p>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2">
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
              <Truck className="w-4 h-4 text-indigo-600 mx-auto" />
              <div className="font-bold text-slate-900">Fast Delivery</div>
              <div className="text-[10px] text-slate-500">By Tomorrow</div>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-900">1 Year Warranty</div>
              <div className="text-[10px] text-slate-500">Brand Covered</div>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
              <RefreshCw className="w-4 h-4 text-purple-600 mx-auto" />
              <div className="font-bold text-slate-900">7 Days Return</div>
              <div className="text-[10px] text-slate-500">Full Refund</div>
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700">Quantity:</label>
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1 text-slate-700 hover:bg-slate-200 rounded-l-xl font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1 text-slate-700 hover:bg-slate-200 rounded-r-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 text-xs flex-1 justify-center rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  setIsCartOpen(true);
                  navigate('/checkout');
                }}
                className="btn-primary bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-6 text-xs flex-1 justify-center rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isLiked ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-200 hover:text-pink-600 shadow-sm'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* 🤖 Non-Intrusive Ask AI Button Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Need help deciding? Ask AI Assistant:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setIsAiOpen(true);
                  sendMessage(`Explain the key specifications and features of ${product.name}`, [product]);
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition cursor-pointer"
              >
                Explain Specifications
              </button>

              <button
                onClick={() => {
                  setIsAiOpen(true);
                  sendMessage(`Find cheaper alternatives to ${product.name} under ₹${product.price}`, [product]);
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition cursor-pointer"
              >
                Find Cheaper Alternatives
              </button>

              <button
                onClick={() => {
                  setIsAiOpen(true);
                  sendMessage(`Recommend top matching accessories for ${product.name}`, [product]);
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition cursor-pointer"
              >
                Recommend Accessories
              </button>
            </div>
          </div>
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
                    className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 text-xs rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{submitting ? 'Posting...' : existingReview ? 'Update Review' : 'Submit Review'}</span>
                  </button>

                  {existingReview && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(existingReview._id)}
                      className="btn-secondary bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 px-4 text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
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

      {/* 🕒 Recently Viewed Products Carousel */}
      <RecentlyViewed
        products={recentlyViewed.filter((p) => (p._id || p.id) !== (product._id || product.id))}
      />

      {/* 📱 Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 lg:hidden shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
          <span className="text-lg font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product, quantity)}
            className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-5 text-xs rounded-xl inline-flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

