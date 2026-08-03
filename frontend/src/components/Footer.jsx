import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headset } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-8 mt-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-200 text-slate-800">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Shipping</h4>
              <p className="text-xs text-slate-500">On all orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Secure Payments</h4>
              <p className="text-xs text-slate-500">100% encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-indigo-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">30-Day Returns</h4>
              <p className="text-xs text-slate-500">Easy doorstep pickup</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headset className="w-8 h-8 text-indigo-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">24/7 AI Support</h4>
              <p className="text-xs text-slate-500">Instant answers anytime</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>NexusMart</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enterprise AI-powered MERN E-Commerce platform with real-time shopping assistant and natural language product intelligence.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=electronics" className="hover:text-indigo-600 transition">Laptops & Electronics</Link></li>
              <li><Link to="/shop?category=audio" className="hover:text-indigo-600 transition">Audio & Wearables</Link></li>
              <li><Link to="/shop?category=apparel" className="hover:text-indigo-600 transition">Apparel & Footwear</Link></li>
              <li><Link to="/shop?category=home" className="hover:text-indigo-600 transition">Home & Living</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Customer Portal</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/orders" className="hover:text-indigo-600 transition">Track Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-600 transition">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 transition">View Shopping Cart</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 transition">User Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Newsletter</h3>
            <p className="text-xs text-slate-500 mb-3">Get exclusive offers & AI deal recommendations delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button className="btn-primary text-xs py-1.5 px-3">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 NexusMart Inc. Built with MERN Stack & AI Assistant.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-700 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 transition cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
