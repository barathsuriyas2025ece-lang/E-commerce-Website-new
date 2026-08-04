import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Privacy & Data Protection Policy</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Your privacy and security are fundamental to NexusMart. Learn how we protect your personal credentials, order details, and payment transactions.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Last Updated: January 2026 • GDPR & DPDP Compliant</span>
        </div>
      </section>

      {/* Policy Clauses */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm text-slate-800 text-xs leading-relaxed">
        <section className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-slate-600">
            We only collect necessary personal information to process your orders, facilitate express deliveries, and personalize your storefront experience:
          </p>
          <ul className="space-y-2 pl-4 text-slate-700 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Account registration data: Full Name, Email Address, and Phone Number.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Fulfillment data: Shipping Address and Delivery Pin Code.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Technical data: Device IP Address, User Agent string for fraud detection.</li>
          </ul>
        </section>

        <section className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. 256-Bit Bank-Grade Encryption & Security</span>
          </h2>
          <p className="text-slate-600">
            All user data, password hashes (using bcrypt algorithm with 10 salt rounds), and API communications are encrypted end-to-end via 256-bit SSL protocols. We strictly enforce rate-limiting, CORS protections, and XSS/CSRF payload validation to prevent unauthorized access.
          </p>
        </section>

        <section className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>3. Zero Third-Party Selling</span>
          </h2>
          <p className="text-slate-600">
            We maintain a strict zero-sharing policy. Your personal credentials, contact numbers, and order histories are never rented, traded, or sold to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>4. Your Data Rights & Contact Info</span>
          </h2>
          <p className="text-slate-600">
            You have full control over your personal account. You may request data deletion or update your profile details directly from your account page anytime. For privacy inquiries, email <strong className="text-slate-900 font-bold">privacy@nexusmart.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
