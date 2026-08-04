import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, ShoppingCart, Heart, Check, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose, onPrev, onNext }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedImg(0);
      setQuantity(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const productId = product._id || product.id || '';
  const isLiked = isInWishlist(productId);
  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close X Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-lg transition cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Previous Product Navigation Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 text-slate-800 hover:bg-indigo-600 hover:text-white shadow-xl flex items-center justify-center transition border border-slate-200 cursor-pointer"
            title="Previous Product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Product Navigation Button */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 text-slate-800 hover:bg-indigo-600 hover:text-white shadow-xl flex items-center justify-center transition border border-slate-200 cursor-pointer"
            title="Next Product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Left Column: Image Preview */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-200">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
            <img
              src={images[selectedImg] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
              loading="lazy"
            />
            {discount && (
              <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 pt-4 overflow-x-auto w-full justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    selectedImg === idx ? 'border-indigo-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
              {product.brand || product.category || 'NexusMart'}
            </div>

            <h2 id="quick-view-title" className="text-xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">({product.numReviews || 124} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-black text-slate-900">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
              {product.description || 'Experience premium quality, high-performance features, and long-lasting durability.'}
            </p>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> In Stock & Ready
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" /> FREE Delivery Tomorrow
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-black text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 btn-primary py-3 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedAnimation ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-white animate-bounce" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-white" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
                  isLiked
                    ? 'bg-pink-50 border-pink-200 text-pink-600 animate-heart-bounce'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-200'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${productId}`}
              onClick={onClose}
              className="text-center block text-xs font-bold text-indigo-600 hover:text-indigo-800 transition pt-1"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default QuickViewModal;
