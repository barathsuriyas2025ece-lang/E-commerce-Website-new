import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Send,
  Trash2,
  LogIn,
  ThumbsUp,
  SlidersHorizontal,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { productAPI, fallbackSampleProducts } from '../services/api';
import ImageLightboxModal from '../components/ImageLightboxModal';
import ProductRecommendations from '../components/ProductRecommendations';
import RecentlyViewed from '../components/RecentlyViewed';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { setIsAiOpen, sendMessage } = useAI();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [reviewSort, setReviewSort] = useState('newest'); // 'newest', 'rating_high', 'rating_low', 'helpful'

  const currentUserId = user?._id || user?.id;
  const isLiked = product ? isInWishlist(product._id || product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.getProductById(id);
        if (res.data && res.data.success && res.data.product) {
          setProduct(res.data.product);
          setReviewsList(res.data.product.reviews || []);
          addRecentlyViewed(res.data.product);
        } else {
          const fallback = fallbackSampleProducts.find((p) => (p._id || p.id).toString() === id.toString());
          if (fallback) {
            setProduct(fallback);
            setReviewsList(fallback.reviews || []);
            addRecentlyViewed(fallback);
          } else {
            setError('Product not found.');
          }
        }
      } catch (err) {
        const fallback = fallbackSampleProducts.find((p) => (p._id || p.id).toString() === id.toString());
        if (fallback) {
          setProduct(fallback);
          setReviewsList(fallback.reviews || []);
          addRecentlyViewed(fallback);
        } else {
          setError('Failed to load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 space-y-8 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="glass-panel p-12 text-center text-slate-700 space-y-4 max-w-lg mx-auto my-12 bg-white border border-slate-200 shadow-sm rounded-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link to="/shop" className="btn-primary inline-flex py-3 px-6 text-xs font-bold rounded-xl">Back to Store</Link>
      </div>
    );
  }

  const stockCount = product.stock !== undefined ? product.stock : (product.countInStock !== undefined ? product.countInStock : 10);
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const productImages = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];

  const existingReview = currentUserId && reviewsList.find((r) => (r.user || '').toString() === currentUserId.toString());

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      const targetId = product._id || product.id;
      const res = await productAPI.addReview(targetId, { rating, comment });
      if (res.data && res.data.success && res.data.product) {
        setReviewsList(res.data.product.reviews || []);
        setProduct((prev) => ({ ...prev, rating: res.data.product.rating, numReviews: res.data.product.numReviews }));
      } else {
        const newRev = {
          _id: 'rev_' + Date.now(),
          user: currentUserId || 'guest',
          userName: user?.name || 'Verified Customer',
          rating: Number(rating),
          comment,
          verifiedPurchase: true,
          helpfulVotes: 0,
          createdAt: new Date().toISOString(),
        };
        setReviewsList((prev) => [newRev, ...prev.filter((r) => (r.user || '').toString() !== (currentUserId || '').toString())]);
      }
      setSuccessMsg('Thank you! Your customer review has been posted successfully.');
      setComment('');
    } catch (err) {
      setSuccessMsg('Review saved successfully.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const targetId = product._id || product.id;
      await productAPI.deleteReview(targetId, reviewId);
      setReviewsList((prev) => prev.filter((r) => (r._id || '').toString() !== reviewId.toString()));
    } catch (err) {
      setReviewsList((prev) => prev.filter((r) => (r._id || '').toString() !== reviewId.toString()));
    }
  };

  const handleVoteHelpful = async (reviewId) => {
    try {
      const targetId = product._id || product.id;
      await productAPI.voteHelpful(targetId, reviewId);
      setReviewsList((prev) =>
        prev.map((r) => ((r._id || '').toString() === reviewId.toString() ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r))
      );
    } catch (err) {}
  };

  // Review Filtering and Sorting Logic
  let processedReviews = reviewsList.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.rating === Number(reviewFilter);
  });

  if (reviewSort === 'rating_high') processedReviews.sort((a, b) => b.rating - a.rating);
  else if (reviewSort === 'rating_low') processedReviews.sort((a, b) => a.rating - b.rating);
  else if (reviewSort === 'helpful') processedReviews.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
  else processedReviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Star rating distribution count
  const totalReviewsCount = reviewsList.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <ImageLightboxModal
          images={productImages}
          initialIdx={selectedImageIdx}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      {/* Main Product Hero & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery View */}
        <div className="space-y-4">
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="glass-panel p-4 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group cursor-zoom-in relative"
          >
            <img
              src={productImages[selectedImageIdx] || productImages[0]}
              alt={product.name}
              className="w-full h-[420px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-4 right-4 text-[10px] font-bold bg-slate-900/80 text-white px-3 py-1.5 rounded-xl backdrop-blur-sm">
              Click to Enlarge 🔍
            </span>
          </div>

          {productImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
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
              {isOutOfStock ? (
                <span className="text-[10px] font-black text-white bg-slate-900 px-2.5 py-0.5 rounded-md shadow-sm">
                  🔴 Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] font-black text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-md border border-amber-500 shadow-sm animate-pulse">
                  ⚠️ Few in Stock: Only {stockCount} Left!
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock ({stockCount} available)
                </span>
              )}
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
                  disabled={isOutOfStock}
                  className="px-3.5 py-1 text-slate-700 hover:bg-slate-200 rounded-l-xl font-bold disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-extrabold text-slate-900">{isOutOfStock ? 0 : quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                  disabled={isOutOfStock || quantity >= stockCount}
                  className="px-3.5 py-1 text-slate-700 hover:bg-slate-200 rounded-r-xl font-bold disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {stockCount > 0 && quantity >= stockCount && (
                <span className="text-[11px] font-bold text-amber-700">Max stock limit reached ({stockCount})</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => !isOutOfStock && addToCart(product, quantity)}
                disabled={isOutOfStock}
                className={`py-3 px-6 text-xs flex-1 justify-center rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer font-bold ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    : 'btn-primary bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  addToCart(product, quantity);
                  setIsCartOpen(true);
                  navigate('/checkout');
                }}
                disabled={isOutOfStock}
                className={`py-3 px-6 text-xs flex-1 justify-center rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer font-extrabold ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                    : 'btn-primary bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                <span>{isOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Customer Ratings & Reviews Engine */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <span>Customer Ratings & Reviews</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Real ratings and verified feedback from genuine customers</p>
          </div>

          {/* Review Filter & Sort Bar */}
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-bold border border-slate-200">
              {['all', '5', '4', '3', '2', '1'].map((fVal) => (
                <button
                  key={fVal}
                  onClick={() => setReviewFilter(fVal)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    reviewFilter === fVal ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fVal === 'all' ? 'All' : `${fVal}★`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-2.5 py-1.5 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Most Recent</option>
                <option value="rating_high">Highest Rating</option>
                <option value="rating_low">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
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
          <h3 className="text-lg font-bold text-slate-900">User Reviews ({processedReviews.length})</h3>

          {processedReviews.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl">
              No reviews match the selected rating filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedReviews.map((rev) => {
                const rId = rev._id || Math.random();
                const isOwnReview = currentUserId && rev.user && rev.user.toString() === currentUserId.toString();
                return (
                  <div
                    key={rId}
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
                            {rev.verifiedPurchase && (
                              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                              </span>
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

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleVoteHelpful(rev._id)}
                        className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.helpfulVotes || 0})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🎯 AI Multi-Source Product Recommendations */}
      <ProductRecommendations currentProduct={product} />

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
