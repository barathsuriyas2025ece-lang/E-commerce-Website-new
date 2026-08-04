import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Headphones, Shirt, Home as HomeIcon, Zap, Star, ShieldCheck, Truck, RefreshCw, Award, CheckCircle2, Clock, Mail, Crown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SubscriptionModal from '../components/SubscriptionModal';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const categories = [
  { name: 'Electronics & Laptops', slug: 'electronics', icon: Laptop, color: 'bg-indigo-600 text-white' },
  { name: 'Audio & Wearables', slug: 'audio', icon: Headphones, color: 'bg-purple-600 text-white' },
  { name: 'Apparel & Footwear', slug: 'apparel', icon: Shirt, color: 'bg-amber-600 text-white' },
  { name: 'Home & Living', slug: 'home', icon: HomeIcon, color: 'bg-emerald-600 text-white' },
];

const featuredBrands = [
  { name: 'Apple', logo: 'https://cdn-icons-png.flaticon.com/512/0/747.png' },
  { name: 'Sony', logo: 'https://cdn-icons-png.flaticon.com/512/882/882747.png' },
  { name: 'Samsung', logo: 'https://cdn-icons-png.flaticon.com/512/882/882736.png' },
  { name: 'Nike', logo: 'https://cdn-icons-png.flaticon.com/512/732/732229.png' },
  { name: 'Asus', logo: 'https://cdn-icons-png.flaticon.com/512/882/882727.png' },
];

const customerReviews = [
  { name: 'Barath Suriya', rating: 5, comment: 'Exceptional delivery speed! The MacBook M3 arrived original and brand new within 24 hours.', location: 'India' },
  { name: 'Ananya Sharma', rating: 5, comment: 'Loved the smooth checkout experience and discount coupons. Best e-commerce storefront!', location: 'India' },
  { name: 'Karthik Raja', rating: 5, comment: 'Great product selection and super fast customer support. Highly recommended.', location: 'India' },
];

const Home = () => {
  const { products } = useProducts();
  const { user } = useAuth();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const safeProducts = products || [];
  const dealsProducts = safeProducts.filter((p) => p.originalPrice > p.price).slice(0, 4);
  const trendingProducts = safeProducts.slice(0, 4);
  const bestSellers = safeProducts.filter((p) => p.isFeatured || true).slice(2, 6);

  return (
    <div className="space-y-12 pb-16">
      {/* 🌟 Personalization Welcome Banner (When Logged In) */}
      {user && (
        <section className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Welcome back, <span className="text-indigo-600">{user.name}</span>! 👋
              {user.isVipSubscriber && (
                <span className="ml-2 inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  <Crown className="w-3 h-3 fill-current" /> VIP Member
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600">Pick up right where you left off in your shopping journey.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            <Link to="/orders" className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-xl transition">
              Orders in Progress
            </Link>
            <Link to="/wishlist" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition">
              View Wishlist
            </Link>
          </div>
        </section>
      )}

      {/* 🚀 Clean Product-First Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-14 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/60 z-0" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>NexusMart Official Storefront</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Find the Best Products at the <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">Best Prices</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Browse thousands of top-rated electronics, fashion, home essentials, and luxury wearables with guaranteed fast delivery.
          </p>

          {/* Clean Primary Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/shop" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-3.5 px-7 rounded-xl font-extrabold inline-flex items-center justify-center shadow-lg shadow-indigo-600/30 transition">
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link to="/shop?tag=deals" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm py-3.5 px-7 rounded-xl font-bold inline-flex items-center justify-center transition">
              <Zap className="w-4 h-4 text-amber-400 mr-2 fill-current" />
              <span>Explore Deals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 📦 Categories Quick Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Explore Top Categories</h2>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group glass-panel p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition flex flex-col items-center text-center space-y-3 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">{cat.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ⚡ Today's Deals (Flash Sale) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-current" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Today's Flash Deals</h2>
              <p className="text-xs text-slate-600">Limited time discounts up to 30% OFF</p>
            </div>
          </div>
          <Link to="/shop?tag=deals" className="btn-primary bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl inline-flex items-center gap-1">
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealsProducts.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🔥 Trending Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Trending Products</h2>
            <p className="text-xs text-slate-500">Most popular picks bought by customers this week</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:underline">See More</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🏆 Best Sellers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Best Sellers</h2>
            <p className="text-xs text-slate-500">Highest rated products with guaranteed warranty</p>
          </div>
          <Link to="/shop?sort=bestseller" className="text-xs font-bold text-indigo-600 hover:underline">See All Best Sellers</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🏷️ Featured Brands */}
      <section className="space-y-4 bg-slate-100 p-6 rounded-3xl">
        <h2 className="text-base font-extrabold text-slate-900 text-center uppercase tracking-wider">
          Official Brand Partners
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
          {featuredBrands.map((b, i) => (
            <span key={i} className="font-extrabold text-base sm:text-lg text-slate-700 tracking-wider">
              {b.name}
            </span>
          ))}
        </div>
      </section>

      {/* 👑 VIP Paid Subscription & Membership Showcase */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white space-y-6 shadow-2xl border border-indigo-900/50 relative overflow-hidden">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Crown className="w-4 h-4 fill-current text-amber-400" />
            <span>NexusMart VIP Prime Pass</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Subscribe & Get <span className="text-amber-400 font-black">Unlimited Free Delivery</span> + Extra Discounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Join NexusMart VIP Membership from just <strong className="text-white font-bold">₹199/month</strong> or <strong className="text-amber-300 font-bold">₹999/year (Save 58%)</strong>. Instant VIP activation upon payment!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => setIsSubModalOpen(true)}
            className="btn-primary bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3.5 px-7 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Subscribe Now (Starts at ₹199)</span>
          </button>
          
          <button
            onClick={() => setIsSubModalOpen(true)}
            className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs py-3.5 px-6 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>View VIP Plans & Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 🛡️ Trust Signals Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
          <Truck className="w-6 h-6 text-indigo-600 mx-auto" />
          <h4 className="font-bold text-xs text-slate-900">Fast Express Shipping</h4>
          <p className="text-[11px] text-slate-500">Free delivery on orders &gt; ₹499</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
          <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-xs text-slate-900">Secure Checkout</h4>
          <p className="text-[11px] text-slate-500">256-bit SSL encrypted</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
          <RefreshCw className="w-6 h-6 text-purple-600 mx-auto" />
          <h4 className="font-bold text-xs text-slate-900">7 Days Easy Return</h4>
          <p className="text-[11px] text-slate-500">Hassle-free money back guarantee</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
          <CheckCircle2 className="w-6 h-6 text-amber-600 mx-auto" />
          <h4 className="font-bold text-xs text-slate-900">100% Genuine Products</h4>
          <p className="text-[11px] text-slate-500">Direct from official brand partners</p>
        </div>
      </section>

      {/* Paid Subscription Modal */}
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
    </div>
  );
};

export default Home;

