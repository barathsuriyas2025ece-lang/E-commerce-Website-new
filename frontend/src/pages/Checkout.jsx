import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Smartphone, Banknote, CheckCircle2, Lock, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { cartItems, subtotal, tax, discountAmount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active step state: 1 = Shipping, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.zipCode || '',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate estimated delivery date (+2 days from today)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please fill in all shipping address fields.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!validateShipping()) {
      setCurrentStep(1);
      return;
    }

    if (paymentMethod === 'Credit Card') {
      if (!cardDetails.cardNumber.trim() || !cardDetails.expDate.trim() || !cardDetails.cvv.trim()) {
        setErrorMessage('Please enter your Card Number, Expiry Date, and CVV.');
        setCurrentStep(2);
        return;
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId.trim()) {
        setErrorMessage('Please enter your UPI ID (e.g. name@upi).');
        setCurrentStep(2);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id || item.id,
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

  if (cartItems.length === 0) {
    return (
      <div className="glass-panel p-12 text-center text-slate-700 space-y-4 max-w-md mx-auto my-12 bg-white border border-slate-200 shadow-sm rounded-3xl">
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer text-xs"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Page Title & Delivery Estimate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Express Checkout</h1>
          <p className="text-xs text-slate-500 pt-1">Complete your order securely in 3 simple steps.</p>
        </div>

        {/* Estimated Delivery Date Pill */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold w-fit shadow-sm">
          <Truck className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Estimated Delivery by <strong className="text-emerald-950 font-black">{formattedDeliveryDate}</strong></span>
        </div>
      </div>

      {/* 3-Step Visual Progress Bar */}
      <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
        {[
          { step: 1, title: '1. Shipping' },
          { step: 2, title: '2. Payment' },
          { step: 3, title: '3. Review' },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              if (s.step === 1 || validateShipping()) {
                setCurrentStep(s.step);
              }
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-black transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === s.step
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                : currentStep > s.step
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {currentStep > s.step ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> : null}
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl max-w-2xl mx-auto">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className={`glass-panel p-6 rounded-3xl space-y-4 bg-white border transition-all ${
            currentStep === 1 ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>1. Delivery Address</span>
              </h2>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 560001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {currentStep === 1 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextToPayment}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-5 text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Payment Details */}
          <div className={`glass-panel p-6 rounded-3xl space-y-4 bg-white border transition-all ${
            currentStep === 2 ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>2. Payment Method</span>
              </h2>
              {currentStep > 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    onClick={() => {
                      setPaymentMethod(pm.id);
                      setCurrentStep(2);
                    }}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-xs font-extrabold transition cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span>{pm.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Inputs */}
            {paymentMethod === 'Credit Card' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Card Details</h3>
                  <div className="flex gap-1.5 text-[10px] font-black text-slate-500">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">VISA</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">MC</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">AMEX</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8921"
                    maxLength={19}
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
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
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
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
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 mt-1 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <label className="text-slate-700 font-semibold">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  placeholder="username@upi or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-5 text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Review & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-indigo-600">{cartItems.length} Items</span>
            </h2>

            {/* Item List Preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Taxes & GST</span>
                <span className="font-bold text-slate-900">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Shipping</span>
                <span className="font-bold text-emerald-600 uppercase">FREE</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                <span className="font-black text-sm">Total Amount:</span>
                <span className="font-black text-xl text-indigo-600">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold py-3 px-4 text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Place Order • ₹{total.toLocaleString()}</span>
                </>
              )}
            </button>

            {/* Trust Assurances */}
            <div className="text-[10px] text-center text-slate-400 space-y-1 pt-1">
              <p>🔒 256-Bit SSL Encrypted Payment</p>
              <p>30-Day Risk Free Return Policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Place Order Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 lg:hidden shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
          <span className="text-lg font-black text-indigo-600">₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-6 text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Processing...' : 'Place Order →'}</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
