import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Award, Users, Zap, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Active Shoppers', value: '1,000,000+', icon: Users },
  { label: 'Genuine Products', value: '50,000+', icon: Sparkles },
  { label: 'On-Time Delivery', value: '99.9%', icon: Truck },
  { label: 'Brand Partners', value: '250+', icon: Award },
];

const values = [
  {
    title: 'Customer Satisfaction First',
    description: 'We prioritize customer happiness through 24/7 dedicated support, 7-day easy returns, and instant resolution.',
    icon: ShieldCheck,
    color: 'bg-indigo-600 text-white',
  },
  {
    title: '100% Genuine Authenticity',
    description: 'Every product listed on NexusMart is sourced directly from official brand manufacturers and verified distributors.',
    icon: Award,
    color: 'bg-emerald-600 text-white',
  },
  {
    title: 'Ultra-Fast Express Shipping',
    description: 'Advanced automated fulfillment centers ensure fast delivery across all Indian pin codes.',
    icon: Truck,
    color: 'bg-purple-600 text-white',
  },
  {
    title: 'AI-Powered Personalization',
    description: 'Smart recommendation engines help you discover products tailored to your preferences effortlessly.',
    icon: Zap,
    color: 'bg-amber-600 text-white',
  },
];

const About = () => {
  return (
    <div className="space-y-16 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 z-0 opacity-90" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>About NexusMart</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Building India's Most <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">Trusted E-Commerce</span> Platform
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            NexusMart was founded with a single mission: to revolutionize online shopping by delivering guaranteed genuine products, lightning-fast fulfillment, and AI-powered customer care.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition">
              <span>Explore Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/careers" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs py-3 px-6 rounded-xl transition">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* 📊 Key Statistics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-2 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <IconComp className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{item.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
            </div>
          );
        })}
      </section>

      {/* 🌟 Our Core Values */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What Drives NexusMart</h2>
          <p className="text-xs text-slate-600">Our core values guide every innovation, order packed, and customer interaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => {
            const IconComp = v.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center shadow-md`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
