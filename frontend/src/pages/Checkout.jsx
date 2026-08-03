import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Smartphone, Banknote, CheckCircle, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { cartItems, subtotal, tax, discountAmount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping Form State (Pre-filled from logged-in user profile if available, editable by user)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.zipCode || '',
  });

  // Payment Details State
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate inputs
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please fill in all shipping address fields.');
      return;
    }

    if (paymentMethod === 'Credit Card') {
      if (!cardDetails.cardNumber.trim() || !cardDetails.expDate.trim() || !cardDetails.cvv.trim()) {
        setErrorMessage('Please enter your Card Number, Expiry Date, and CVV.');
        return;
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId.trim()) {
        setErrorMessage('Please enter your UPI ID (e.g. name@upi).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0],
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        discountAmount,
        totalPrice: total,
      };

      const res = await orderAPI.createOrder(orderPayload);
      if (res.data.success) {
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      clearCart();
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Checkout & Payment</h1>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Form */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>1. Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-700 font-bold">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="House / Flat No, Street, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold">City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold">State & Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 560001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector & Inputs */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>2. Select & Enter Payment Details</span>
            </h2>

            {/* Payment Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'Credit Card', name: 'Credit / Debit Card', icon: CreditCard },
                { id: 'UPI', name: 'UPI (GPay / PhonePe)', icon: Smartphone },
                { id: 'COD', name: 'Cash on Delivery', icon: Banknote },
              ].map((pm) => {
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition ${
                      paymentMethod === pm.id
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-indigo-600" />
                    <span>{pm.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Dynamic Payment Fields */}
            <div className="pt-3">
              {paymentMethod === 'Credit Card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Enter Card Details</h3>
                  <div>
                    <label className="text-slate-700 font-semibold">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      maxLength={19}
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expDate}
                        onChange={(e) => setCardDetails({ ...cardDetails, expDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-semibold">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Enter UPI ID</h3>
                  <div>
                    <label className="text-slate-700 font-semibold">VPA / Virtual Payment Address</label>
                    <input
                      type="text"
                      placeholder="yourname@upi (e.g. mobile@okicici)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <h3 className="font-bold">Cash on Delivery Selected</h3>
                  <p>Pay with cash directly to the delivery agent upon package arrival at your doorstep.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Confirmation Summary */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-6 bg-white border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Final Order Total</h2>

          <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
            <div className="flex justify-between text-slate-600 font-medium"><span>Items Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount:</span><span>-₹{discountAmount.toLocaleString()}</span></div>}
            <div className="flex justify-between text-slate-600 font-medium"><span>Estimated Tax:</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-900 text-base font-extrabold pt-2">
              <span>Payable Total:</span>
              <span className="text-indigo-600">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center text-sm py-3 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing Payment...' : 'Confirm & Complete Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
