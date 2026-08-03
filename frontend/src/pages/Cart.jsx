import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponAPI } from '../services/api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, discountAmount, total, appliedCoupon, setAppliedCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await couponAPI.validate({ code: couponCode, cartTotal: subtotal });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponMsg(res.data.message);
      }
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="glass-panel p-12 text-center text-slate-700 space-y-4 max-w-lg mx-auto my-12 bg-white border border-slate-200 shadow-sm">
        <ShoppingBag className="w-16 h-16 text-indigo-600 mx-auto opacity-70" />
        <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500">Discover our collection and start adding your favorite products!</p>
        <Link to="/shop" className="btn-primary inline-flex">Explore Catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-indigo-600 font-extrabold">₹{item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Quantity adjustment */}
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-bold">-</button>
                  <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-bold">+</button>
                </div>

                <div className="text-sm font-extrabold text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>

                <button onClick={() => removeFromCart(item._id)} className="p-2 text-slate-400 hover:text-red-600 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-6 bg-white border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>Have a Promo Coupon?</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SAVE10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 uppercase font-bold focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="btn-secondary py-1.5 px-3 text-xs">Apply</button>
            </div>
            {couponMsg && <p className="text-xs text-indigo-600 font-semibold">{couponMsg}</p>}
          </form>

          {/* Financial Totals */}
          <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-600 font-medium"><span>Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({appliedCoupon.code}):</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 font-medium"><span>Estimated Tax (5%):</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-900 font-extrabold text-base pt-3 border-t border-slate-100">
              <span>Total:</span>
              <span className="text-indigo-600">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => navigate('/checkout')} className="btn-primary w-full justify-center text-sm py-3">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
