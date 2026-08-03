import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Scale, Truck, Zap, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';

const ProductCard = ({ product }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setActiveCompareItems } = useAI();
  const navigate = useNavigate();

  const productId = product._id || product.id || '';
  const isLiked = isInWishlist(productId);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="glass-panel group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-200 rounded-2xl">
      {/* Product Image Container (100% Clickable Link to Product Details) */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/product/${productId}`} className="block w-full h-full cursor-pointer">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isFeatured && (
            <span className="badge bg-amber-500 text-white font-extrabold shadow-sm flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 fill-current" /> Top Choice
            </span>
          )}
          {discount && (
            <span className="badge bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer ${
              isLiked ? 'bg-pink-600 text-white' : 'bg-white/90 text-slate-700 hover:text-pink-600'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveCompareItems([product]);
            }}
            className="w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-indigo-600 backdrop-blur-md shadow-md flex items-center justify-center transition cursor-pointer"
            title="Compare Product"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              {product.category || 'Electronics'}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>

          <Link to={`/product/${productId}`} className="block group-hover:text-indigo-600">
            <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-2 leading-tight mt-1 cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-extrabold ml-1 text-slate-800">{product.rating || 4.5}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">({product.numReviews || 128} reviews)</span>
          </div>

          {/* Amazon Express Delivery Badge */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-1 font-medium">
            <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><strong className="text-emerald-700">FREE Delivery</strong> by Tomorrow</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-extrabold text-slate-900">
              ₹{product.price?.toLocaleString()}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="btn-secondary bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-2 text-xs rounded-xl inline-flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-slate-700" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-primary bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold py-1.5 px-2 text-xs rounded-xl inline-flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
