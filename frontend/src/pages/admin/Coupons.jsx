import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';

const sampleCoupons = [
  { code: 'SAVE10', discountPercentage: 10, maxDiscountAmount: 2000, minPurchaseAmount: 1000, isActive: true },
  { code: 'WELCOME20', discountPercentage: 20, maxDiscountAmount: 3000, minPurchaseAmount: 1500, isActive: true },
];

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState(sampleCoupons);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Coupons & Promo Codes</h1>
          <p className="text-xs text-slate-400">Manage promotional discounts available for customer checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-lg text-indigo-400 uppercase tracking-wider">{c.code}</span>
              <span className="badge badge-stock">Active</span>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div>Discount: <span className="font-bold text-white">{c.discountPercentage}% Off</span></div>
              <div>Min Purchase: <span className="font-semibold text-slate-200">₹{c.minPurchaseAmount.toLocaleString()}</span></div>
              <div>Max Discount: <span className="font-semibold text-slate-200">₹{c.maxDiscountAmount.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
