import React from 'react';
import { FileText, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';

const Terms = () => {
  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Terms of Service & Policies</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Please review the official terms, shipping guidelines, 7-day easy returns policy, and customer agreements for NexusMart E-Commerce.
        </p>
      </section>

      {/* Terms Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm text-slate-800 text-xs leading-relaxed">
        <section className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span>1. 7-Day Easy Returns & Refund Policy</span>
          </h2>
          <p className="text-slate-600">
            NexusMart provides a 7-day hassle-free return window for all electronics, apparel, and home products. If you receive a damaged or unsatisfactory item:
          </p>
          <ul className="space-y-2 pl-4 text-slate-700 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Initiate return directly from your <strong className="text-slate-900">My Orders</strong> dashboard.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Free reverse doorstep pickup dispatched within 24 hours.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% full refund credited immediately upon item inspection.</li>
          </ul>
        </section>

        <section className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            <span>2. Express Shipping & Delivery Terms</span>
          </h2>
          <p className="text-slate-600">
            All orders over ₹499 qualify for Free Express Shipping across India. Estimated delivery times:
          </p>
          <ul className="space-y-2 pl-4 text-slate-700 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Metro cities: 24 to 48 hours.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Rest of India: 2 to 4 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>3. Product Warranty & Authenticity</span>
          </h2>
          <p className="text-slate-600">
            All products carry original brand manufacturer warranties (typically 1 year for electronics and wearables). Invoices issued by NexusMart are tax-compliant and valid for official warranty claims nationwide.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
