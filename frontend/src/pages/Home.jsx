import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Laptop, Headphones, Shirt, Home as HomeIcon, Zap, Bot, Truck, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useAI } from '../context/AIContext';

const categories = [
  { name: 'Electronics & Laptops', slug: 'electronics', icon: Laptop, color: 'bg-indigo-600 text-white' },
  { name: 'Audio & Wearables', slug: 'audio', icon: Headphones, color: 'bg-purple-600 text-white' },
  { name: 'Apparel & Footwear', slug: 'apparel', icon: Shirt, color: 'bg-amber-600 text-white' },
  { name: 'Home & Living', slug: 'home', icon: HomeIcon, color: 'bg-emerald-600 text-white' },
];

const Home = () => {
  const { products } = useProducts();
  const { setIsAiOpen, sendMessage } = useAI();

  const featuredProducts = (products || []).filter((p) => p?.isFeatured || true).slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Light & Professional Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-14 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Next-Gen Enterprise MERN Storefront</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Shop Smarter with <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">AI Intelligence</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Discover curated electronics, luxury apparel, and wearables. Ask our floating AI shopping assistant to compare products, match your budget, and auto-apply discount coupons!
          </p>

          {/* Correctly Aligned CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/shop" className="btn-primary text-sm py-3 px-6 inline-flex items-center justify-center">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <button
              onClick={() => {
                setIsAiOpen(true);
                sendMessage("Suggest gaming laptops under ₹70,000", featuredProducts);
              }}
              className="btn-secondary text-sm py-3 px-6 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Bot className="w-4 h-4 text-indigo-300 mr-2" />
              <span>Ask AI for Laptops</span>
            </button>
          </div>
        </div>
      </section>

      {/* Category Quick Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Shop by Category</h2>
            <p className="text-xs text-slate-500">Explore items tailored to your lifestyle</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:underline">View All →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/shop?category=${cat.slug}`}
                className="glass-panel p-6 group hover:-translate-y-1 transition duration-300 flex items-center justify-between bg-white border border-slate-200 shadow-sm hover:shadow-md"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-base">{cat.name}</h3>
                  <p className="text-xs text-slate-500">Browse Catalog</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🛡️ Amazon-Style Trust & Customer Assurance Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">FREE & Fast Delivery</h4>
            <p className="text-xs text-slate-500 mt-0.5">Express shipping on orders above ₹499</p>
          </div>
        </div>

        <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">7-Day Easy Return</h4>
            <p className="text-xs text-slate-500 mt-0.5">100% Money-back replacement guarantee</p>
          </div>
        </div>

        <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-amber-600 fill-current" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">100% Genuine Products</h4>
            <p className="text-xs text-slate-500 mt-0.5">Directly sourced official brand stock</p>
          </div>
        </div>

        <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">24/7 AI Shopping Help</h4>
            <p className="text-xs text-slate-500 mt-0.5">Instant voice & text action support</p>
          </div>
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Trending & Featured Products</span>
              <Zap className="w-5 h-5 text-amber-500 fill-current" />
            </h2>
            <p className="text-xs text-slate-500">Top customer picks with high ratings & fast delivery</p>
          </div>
          <Link to="/shop" className="btn-secondary py-2 px-4 text-xs">Browse Shop</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-500/30">
        <div className="space-y-4 max-w-xl">
          <span className="badge bg-white/20 text-white border border-white/30 px-3 py-1 text-xs">Action-Oriented AI</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Experience AI Voice & Action Shopping</h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Our floating assistant doesn't just talk — it takes actions for you! Compare specs, add items to cart, track packages, and apply promo codes through voice or text commands.
          </p>
          <button onClick={() => setIsAiOpen(true)} className="btn-secondary text-sm py-2.5 px-6 bg-white text-indigo-700 hover:bg-slate-100 border-none font-bold shadow-md">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Launch AI Assistant</span>
          </button>
        </div>

        <div className="w-full md:w-80 p-6 bg-slate-900/80 backdrop-blur-xl border border-indigo-400/40 shadow-2xl rounded-2xl text-xs space-y-3 text-white">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-white/10 pb-2">
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Try these AI Prompts:</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-white font-medium cursor-pointer transition shadow-sm flex items-center justify-between" onClick={() => { setIsAiOpen(true); sendMessage("Compare first two laptops"); }}>
            <span>"Compare the first two laptops"</span>
            <span className="text-indigo-300 text-xs">→</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-white font-medium cursor-pointer transition shadow-sm flex items-center justify-between" onClick={() => { setIsAiOpen(true); sendMessage("Apply coupon SAVE10"); }}>
            <span>"Apply coupon SAVE10 to my cart"</span>
            <span className="text-indigo-300 text-xs">→</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-white font-medium cursor-pointer transition shadow-sm flex items-center justify-between" onClick={() => { setIsAiOpen(true); sendMessage("Where is my order?"); }}>
            <span>"Where is my order #10231?"</span>
            <span className="text-indigo-300 text-xs">→</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
