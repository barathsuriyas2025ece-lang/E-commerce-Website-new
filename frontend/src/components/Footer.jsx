import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headset, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20 shadow-xl relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-slate-200">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Products</h4>
              <p className="text-xs text-slate-400">Direct from official partners</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Easy Return</h4>
              <p className="text-xs text-slate-400">Hassle-free money back</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headset className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
              <p className="text-xs text-slate-400">Live agent & AI assistance</p>
            </div>
          </div>
        </div>

        {/* Professional 5-Column Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 text-xs">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-xl font-black text-white">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Nexus<span className="text-indigo-400">Mart</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's premier high-performance e-commerce marketplace delivering quality electronics, fashion, and lifestyle products.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-white tracking-wider uppercase mb-3 text-[11px]">Shop Categories</h3>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/shop?category=electronics" className="hover:text-indigo-400 transition">Electronics & Laptops</Link></li>
              <li><Link to="/shop?category=audio" className="hover:text-indigo-400 transition">Audio & Wearables</Link></li>
              <li><Link to="/shop?category=apparel" className="hover:text-indigo-400 transition">Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=home" className="hover:text-indigo-400 transition">Home & Kitchen</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-white tracking-wider uppercase mb-3 text-[11px]">Customer Support</h3>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/orders" className="hover:text-indigo-400 transition">Track Orders</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">My Account</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400 transition">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-white tracking-wider uppercase mb-3 text-[11px]">Company & Policy</h3>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-400 transition">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-white tracking-wider uppercase mb-3 text-[11px]">Mobile App</h3>
            <p className="text-slate-400 mb-3">Download NexusMart App for exclusive mobile deals.</p>
            <div className="space-y-2">
              <Link
                to="/download-app"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer shadow-md"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Download App</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 NexusMart E-Commerce Inc. All Rights Reserved.</p>
          <div className="flex gap-4 text-slate-400 font-medium">
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
