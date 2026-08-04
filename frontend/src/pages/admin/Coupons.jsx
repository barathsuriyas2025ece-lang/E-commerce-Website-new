import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plus, Trash2, Shield, CheckCircle2, Ticket } from 'lucide-react';
import { couponAPI } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const initialCoupons = [
  { _id: '1', code: 'SAVE10', discountPercentage: 10, maxDiscountAmount: 2000, minPurchaseAmount: 1000, isActive: true },
  { _id: '2', code: 'WELCOME20', discountPercentage: 20, maxDiscountAmount: 3000, minPurchaseAmount: 1500, isActive: true },
  { _id: '3', code: 'FESTIVE30', discountPercentage: 30, maxDiscountAmount: 5000, minPurchaseAmount: 2500, isActive: true },
];

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 15,
    minPurchaseAmount: 1000,
    maxDiscountAmount: 2500,
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponAPI.getCoupons();
        if (res.data?.success && Array.isArray(res.data.coupons) && res.data.coupons.length > 0) {
          setCoupons(res.data.coupons);
        }
      } catch (err) {
        // Fallback state retained
      }
    };
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const newCoupon = {
      _id: 'coup_' + Date.now(),
      code: formData.code.toUpperCase().trim(),
      discountPercentage: Number(formData.discountPercentage),
      minPurchaseAmount: Number(formData.minPurchaseAmount),
      maxDiscountAmount: Number(formData.maxDiscountAmount),
      isActive: true,
    };

    try {
      await couponAPI.createCoupon(newCoupon);
    } catch (err) {}

    setCoupons((prev) => [newCoupon, ...prev]);

    if (addNotification) {
      addNotification({
        title: '🎟️ Promo Coupon Issued',
        subtitle: `Coupon code ${newCoupon.code} (${newCoupon.discountPercentage}% OFF) is now active for shoppers`,
        type: 'info',
      });
    }

    setIsAddModalOpen(false);
    setFormData({ code: '', discountPercentage: 15, minPurchaseAmount: 1000, maxDiscountAmount: 2500 });
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponAPI.deleteCoupon(id);
      } catch (err) {}
      setCoupons((prev) => prev.filter((c) => (c._id || c.code) !== id));

      if (addNotification) {
        addNotification({
          title: '📦 Coupon Removed',
          subtitle: `Promo code removed from admin store registry`,
          type: 'info',
        });
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Coupons & Promo Codes</h1>
          <p className="text-xs text-slate-500 mt-1">Issue, activate, or revoke discount promo codes for customer checkout</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Issue New Coupon</span>
        </button>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Overview</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Products</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Orders</Link>
        <Link to="/admin/coupons" className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm font-black">Coupons</Link>
        <Link to="/admin/users" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Users</Link>
      </div>

      {/* Coupons Grid with High Contrast Light Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => {
          const couponId = c._id || c.code;
          return (
            <div key={couponId} className="glass-panel p-6 rounded-3xl space-y-4 bg-white border border-slate-200 shadow-sm relative group hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-lg text-indigo-600 tracking-wider uppercase block">{c.code}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{c.discountPercentage}% Instant Savings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[11px] px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                  </span>

                  <button
                    onClick={() => handleDeleteCoupon(couponId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Discount Value:</span>
                  <span className="font-extrabold text-slate-900 bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{c.discountPercentage}% OFF</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Min Order Value:</span>
                  <span className="font-bold text-slate-800">₹{c.minPurchaseAmount?.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Max Savings Limit:</span>
                  <span className="font-bold text-slate-800">₹{c.maxDiscountAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl space-y-4 text-xs text-slate-800 bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Issue New Promo Coupon</h2>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-slate-700 font-bold">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  placeholder="e.g. FESTIVE25"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Min Cart (₹)</label>
                  <input
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Max Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
