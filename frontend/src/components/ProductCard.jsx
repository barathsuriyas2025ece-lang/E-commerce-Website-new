import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Scale, Truck, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';
import { useProducts } from '../context/ProductContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(product);
  const [isAdded, setIsAdded] = useState(false);

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setActiveCompareItems } = useAI();

  if (!product) return null;

  const currentModalProd = activeProduct || product;
  const productId = product._id || product.id || '';
  const isLiked = isInWishlist(productId);

  const stock = product.stock !== undefined
    ? product.stock
    : (product.countInStock !== undefined ? product.countInStock : 10);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const added = addToCart(product);
    if (added !== false) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  const brandName = product.brand || product.category || 'NexusMart';

  // Catalog Prev/Next navigation logic for QuickView modal
  const catalogList = products && products.length > 0 ? products : [product];
  const currentIdx = catalogList.findIndex(
    (p) => (p._id || p.id || '').toString() === (currentModalProd._id || currentModalProd.id || '').toString()
  );

  const handlePrevProduct = () => {
    if (catalogList.length <= 1) return;
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : catalogList.length - 1;
    setActiveProduct(catalogList[prevIdx]);
  };

  const handleNextProduct = () => {
    if (catalogList.length <= 1) return;
    const nextIdx = currentIdx < catalogList.length - 1 ? currentIdx + 1 : 0;
    setActiveProduct(catalogList[nextIdx]);
  };

  return (
    <>
      <div className="glass-panel group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-slate-200 rounded-2xl relative">
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Link to={`/product/${productId}`} className="block w-full h-full cursor-pointer">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer ${
                isOutOfStock ? 'grayscale opacity-75' : ''
              }`}
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="badge bg-slate-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span className="badge bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm animate-pulse">
                ONLY {stock} LEFT!
              </span>
            ) : discount ? (
              <span className="badge bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                -{discount}% OFF
              </span>
            ) : null}
          </div>

          {/* Quick View Hover Button Bar */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveProduct(product);
                setIsQuickViewOpen(true);
              }}
              className="w-full py-2 bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center gap-1.5 hover:bg-slate-900 hover:text-white transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
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
                isLiked ? 'bg-pink-600 text-white animate-heart-bounce' : 'bg-white/90 text-slate-700 hover:text-pink-600'
              }`}
              aria-label="Toggle Wishlist"
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
              aria-label="Compare Product"
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
                <Star className="w-3 h-3 fill-current mr-0.5 text-amber-400" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">({product.numReviews || 248})</span>
            </div>

            {/* Delivery & Stock */}
            <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 gap-1">
              {isOutOfStock ? (
                <span className="text-red-600 font-extrabold flex items-center gap-0.5">
                  🔴 Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-extrabold flex items-center gap-0.5">
                  ⚠️ Few in Stock ({stock} left)
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <Check className="w-3 h-3 text-emerald-600" /> In Stock
                </span>
              )}
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Truck className="w-3 h-3 text-indigo-600" /> FREE Delivery
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
              disabled={isOutOfStock}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Added ✓</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal Portal */}
      <QuickViewModal
        product={currentModalProd}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onPrev={catalogList.length > 1 ? handlePrevProduct : null}
        onNext={catalogList.length > 1 ? handleNextProduct : null}
      />
    </>
  );
};

export default ProductCard;
