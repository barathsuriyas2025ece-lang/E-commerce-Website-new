import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Scale, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setActiveCompareItems } = useAI();

  const productId = product._id || product.id || '';
  const isLiked = isInWishlist(productId);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const brandName = product.brand || product.category || 'NexusMart';

  return (
    <div className="glass-panel group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-200 rounded-2xl relative">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/product/${productId}`} className="block w-full h-full cursor-pointer">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discount && (
            <span className="badge bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Floating Heart & Compare Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition cursor-pointer ${
              isLiked ? 'bg-pink-600 text-white' : 'bg-white/90 text-slate-700 hover:text-pink-600'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveCompareItems([product]);
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-indigo-600 backdrop-blur-md shadow-sm flex items-center justify-center transition cursor-pointer"
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1">
          {/* Brand Name */}
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {brandName}
          </div>

          {/* Title */}
          <Link to={`/product/${productId}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-2 leading-snug cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 text-xs font-extrabold">
              <Star className="w-3 h-3 fill-current mr-0.5" />
              <span>{product.rating || 4.8}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">({product.numReviews || 248})</span>
          </div>

          {/* Delivery & Stock */}
          <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 gap-1">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <Check className="w-3 h-3 text-emerald-600" /> In Stock
            </span>
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Truck className="w-3 h-3 text-indigo-600" /> FREE Delivery Tomorrow
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2 px-3 text-xs rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
