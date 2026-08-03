import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Sparkles, Shield, Package, MapPin, Flame, Award, Truck, X, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAI } from '../context/AIContext';
import { useProducts } from '../context/ProductContext';
import NotificationBell from '../notifications/NotificationBell';

const trendingSearches = ['MacBook M3', 'Sony Headphones', 'Wireless Earbuds', 'Gaming Laptop', 'Running Shoes'];

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen, clearCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { setIsAiOpen } = useAI();
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Filter matching products for instant mega-search suggestion box
  const searchSuggestions = (products || []).filter((p) => {
    if (!searchTerm.trim()) return false;
    const q = searchTerm.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  }).slice(0, 5);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    clearCart();
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors duration-300">
      {/* Top Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                Nexus<span className="text-indigo-600">Mart</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Storefront</span>
            </div>
          </Link>

          {/* 🔍 Prominent Mega Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block z-50">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search thousands of products, brands & deals..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition shadow-inner font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Mega Search Overlay Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-4 animate-fade-in">
                {/* Instant Product Suggestions */}
                {searchTerm.trim() ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Matching Products</span>
                      <span>{searchSuggestions.length} results</span>
                    </div>
                    {searchSuggestions.length === 0 ? (
                      <div className="text-xs text-slate-400 py-3 text-center">No exact matches found</div>
                    ) : (
                      searchSuggestions.map((prod) => (
                        <div
                          key={prod._id || prod.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/product/${prod._id || prod.id}`);
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-50/60 transition cursor-pointer group"
                        >
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">{prod.name}</h4>
                            <span className="text-[10px] text-slate-400 capitalize">{prod.category}</span>
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 shrink-0">₹{prod.price?.toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Trending Searches & Quick Filters */
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchTerm(term);
                            setIsSearchFocused(false);
                            navigate(`/shop?search=${encodeURIComponent(term)}`);
                          }}
                          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold text-slate-700 transition cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold flex items-center gap-1.5 hover:bg-indigo-100 transition shadow-sm cursor-pointer"
              title="Launch AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders Icon */}
            <Link
              to="/orders"
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-indigo-600" />
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition cursor-pointer"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin Panel Link */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 hidden lg:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-500 hover:text-slate-800 transition underline font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
                <User className="w-3.5 h-3.5 text-white" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Amazon-Style Sub-Header Navigation Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Location & Links */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 text-slate-300 font-medium hover:text-white cursor-pointer transition">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deliver to <strong className="text-white">India</strong></span>
            </div>

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            <Link to="/shop?tag=deals" className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Today's Deals</span>
            </Link>

            <Link to="/shop?sort=bestseller" className="flex items-center gap-1 font-medium hover:text-white transition">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Best Sellers</span>
            </Link>

            <Link to="/shop?category=electronics" className="hidden lg:inline hover:text-white transition">
              Electronics
            </Link>
            <Link to="/shop?category=apparel" className="hidden lg:inline hover:text-white transition">
              Fashion & Apparel
            </Link>
            <Link to="/orders" className="hidden sm:inline hover:text-white transition">
              Orders & Tracking
            </Link>
          </div>

          {/* Right Free Shipping Banner */}
          <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>FREE Express Delivery on Orders over ₹499</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
