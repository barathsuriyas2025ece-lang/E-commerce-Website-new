import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headset, Smartphone, X, CheckCircle2, Download, Briefcase, Info, FileText, Lock, QrCode, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'careers' | 'privacy' | 'terms' | 'security' | 'app' | null
  const [appNotice, setAppNotice] = useState('');
  const [careerApplied, setCareerApplied] = useState('');
  const { setNotification } = useAuth();

  const handleDownloadApp = (platform) => {
    setAppNotice(`🎉 NexusMart ${platform} App build initiated! Check your downloads.`);
    if (setNotification) {
      setNotification(`📱 Downloading NexusMart Mobile App (${platform})...`);
    }
    setTimeout(() => setAppNotice(''), 4000);
  };

  const handleApplyCareer = (jobTitle) => {
    setCareerApplied(`🎉 Application submitted for ${jobTitle}! Our HR team will reach out via email.`);
    setTimeout(() => setCareerApplied(''), 4000);
  };

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
              <li>
                <button onClick={() => setActiveModal('about')} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('careers')} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('terms')} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-white tracking-wider uppercase mb-3 text-[11px]">Mobile App</h3>
            <p className="text-slate-400 mb-3">Download NexusMart App for exclusive mobile deals.</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveModal('app')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer shadow-md"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Download App</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 NexusMart E-Commerce Inc. All Rights Reserved.</p>
          <div className="flex gap-4 text-slate-400 font-medium">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition cursor-pointer">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('security')} className="hover:text-white transition cursor-pointer">
              Security
            </button>
          </div>
        </div>
      </div>

      {/* 🌐 Interactive Footer Information & App Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                {activeModal === 'about' && <Info className="w-5 h-5 text-indigo-400" />}
                {activeModal === 'careers' && <Briefcase className="w-5 h-5 text-amber-400" />}
                {activeModal === 'privacy' && <Lock className="w-5 h-5 text-emerald-400" />}
                {activeModal === 'terms' && <FileText className="w-5 h-5 text-blue-400" />}
                {activeModal === 'security' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                {activeModal === 'app' && <Smartphone className="w-5 h-5 text-indigo-400" />}
                <h3 className="font-black text-white text-base capitalize">
                  {activeModal === 'about' && 'About NexusMart'}
                  {activeModal === 'careers' && 'Career Opportunities'}
                  {activeModal === 'privacy' && 'Privacy & Data Protection Policy'}
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'security' && 'Security & Encryption Standards'}
                  {activeModal === 'app' && 'Download NexusMart Mobile App'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Contents */}
            {activeModal === 'about' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p>
                  <strong>NexusMart</strong> is India's leading next-generation e-commerce platform built to deliver ultra-fast shopping experiences, authentic brand products, and transparent pricing.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                    <div className="text-xl font-black text-indigo-400">1M+</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Happy Customers</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                    <div className="text-xl font-black text-emerald-400">99.9%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">On-Time Delivery</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Headquartered in Innovation Hub, India. Powered by enterprise MERN architecture, AI assistant integration, and real-time inventory management.
                </p>
              </div>
            )}

            {activeModal === 'careers' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300">Join our team of engineers, designers, and e-commerce innovators!</p>
                {careerApplied && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl font-bold">
                    {careerApplied}
                  </div>
                )}
                <div className="space-y-2.5">
                  {[
                    { title: 'Senior Fullstack Engineer (React & Node)', dept: 'Engineering', loc: 'Bengaluru / Remote' },
                    { title: 'AI Assistant & ML Specialist', dept: 'AI Lab', loc: 'Remote' },
                    { title: 'Product Manager - E-Commerce Operations', dept: 'Product', loc: 'Bengaluru' },
                  ].map((job, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white text-xs">{job.title}</h4>
                        <div className="text-[10px] text-slate-400">{job.dept} • {job.loc}</div>
                      </div>
                      <button
                        onClick={() => handleApplyCareer(job.title)}
                        className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto pr-1">
                <h4 className="font-bold text-white text-xs">1. Data Privacy Guarantee</h4>
                <p>We respect your privacy. Personal credentials and delivery information are strictly encrypted using 256-bit AES protocol and never sold to third parties.</p>
                <h4 className="font-bold text-white text-xs">2. Payment Security</h4>
                <p>Payment details (UPI, Cards, NetBanking) are securely tokenized through PCI-DSS compliant payment gateways.</p>
                <h4 className="font-bold text-white text-xs">3. Cookie & Analytics Usage</h4>
                <p>We use essential cookies strictly to maintain your active cart, wishlist, and session authentication.</p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto pr-1">
                <h4 className="font-bold text-white text-xs">1. 7-Day Easy Returns</h4>
                <p>Items can be returned within 7 days of delivery in original packaging for a 100% full refund.</p>
                <h4 className="font-bold text-white text-xs">2. Free Express Shipping</h4>
                <p>Orders above ₹499 qualify for free express shipping across all India pin codes.</p>
                <h4 className="font-bold text-white text-xs">3. Product Warranty</h4>
                <p>All electronic and wearable items carry 1-year official brand manufacturer warranty.</p>
              </div>
            )}

            {activeModal === 'security' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 bg-purple-950/50 border border-purple-800/60 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Bank-Grade 256-bit SSL Encryption</h4>
                    <p className="text-[11px] text-purple-200">All data transmitted between your browser and NexusMart servers is encrypted.</p>
                  </div>
                </div>
                <p>Our infrastructure undergoes automated security audits, rate-limiting protection, and XSS/CSRF payload validation.</p>
              </div>
            )}

            {activeModal === 'app' && (
              <div className="space-y-5 text-xs text-center">
                {appNotice && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl font-bold">
                    {appNotice}
                  </div>
                )}

                {/* QR Code Demo Simulation */}
                <div className="bg-white p-4 rounded-2xl w-36 h-36 mx-auto flex flex-col items-center justify-center shadow-lg text-slate-900 space-y-1 border-4 border-indigo-500/30">
                  <QrCode className="w-20 h-20 text-slate-900" />
                  <span className="text-[9px] font-black uppercase text-indigo-600">Scan to Download</span>
                </div>

                <p className="text-slate-300 text-xs">
                  Scan the QR code with your smartphone camera or click below to install the official NexusMart Mobile App for iOS & Android.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadApp('iOS (App Store)')}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>iOS App Store</span>
                  </button>

                  <button
                    onClick={() => handleDownloadApp('Android APK')}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Android APK</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </footer>
  );
};

export default Footer;
