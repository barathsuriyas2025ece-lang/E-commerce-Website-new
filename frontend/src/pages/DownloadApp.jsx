import React, { useState } from 'react';
import { Smartphone, Download, QrCode, Sparkles, CheckCircle2, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const appFeatures = [
  { title: '15% App-Exclusive Discount', desc: 'Get an extra 15% OFF your first in-app order using coupon NEXUSAPP.', icon: Sparkles },
  { title: 'Live Package GPS Tracking', desc: 'Track your delivery courier on live interactive maps in real-time.', icon: Zap },
  { title: 'Instant Flash Sale Alerts', desc: 'Be the first to get notified when ultra-discounted flash deals go live.', icon: Star },
  { title: 'AR Product Preview', desc: 'Preview electronics and wearables in augmented reality before buying.', icon: Smartphone },
];

const DownloadApp = () => {
  const [downloadMsg, setDownloadMsg] = useState('');
  const { setNotification } = useAuth();

  const handleDownload = (platform) => {
    setDownloadMsg(`🎉 Initiating ${platform} App Build Download...`);
    if (setNotification) {
      setNotification(`📱 Downloading NexusMart ${platform} App package!`);
    }
    setTimeout(() => setDownloadMsg(''), 4000);
  };

  return (
    <div className="space-y-14 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* 🚀 Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>NexusMart Official Mobile App</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Shop Smarter & Faster on <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">iOS & Android</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Download the NexusMart mobile app to unlock 15% app-only discounts, real-time GPS courier tracking, and instant deal notifications.
          </p>

          {downloadMsg && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleDownload('iOS App Store')}
              className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download for iOS (App Store)</span>
            </button>

            <button
              onClick={() => handleDownload('Android APK')}
              className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs py-3.5 px-6 rounded-xl inline-flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Android APK</span>
            </button>
          </div>
        </div>

        {/* 📷 QR Code Box */}
        <div className="bg-white p-6 rounded-3xl text-center space-y-3 shadow-2xl text-slate-900 shrink-0 border-4 border-indigo-500/20 max-w-xs w-full">
          <div className="w-40 h-40 bg-slate-900 p-3 rounded-2xl mx-auto flex flex-col items-center justify-center text-white shadow-inner">
            <QrCode className="w-28 h-28 text-white" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-sm text-slate-900">Scan to Install</h4>
            <p className="text-[11px] text-slate-500 font-medium">Point phone camera at QR code</p>
          </div>
        </div>
      </section>

      {/* 🌟 App Features Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Download the Mobile App?</h2>
          <p className="text-xs text-slate-600">Built for speed, convenience, and maximum savings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {appFeatures.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DownloadApp;
