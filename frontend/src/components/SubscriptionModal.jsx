import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, X, CreditCard, Smartphone, Building2, Crown, Lock, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    id: 'monthly',
    name: 'VIP Monthly Pass',
    price: 199,
    period: 'per month',
    savings: null,
    badge: null,
    description: 'Perfect for short-term shopping sprees & flash sales.',
  },
  {
    id: 'annual',
    name: 'VIP Pro Annual',
    price: 999,
    period: 'per year',
    savings: 'Save 58%',
    badge: 'MOST POPULAR',
    description: 'Unlimited free express shipping + 10% extra discount year-round.',
  },
  {
    id: 'quarterly',
    name: 'VIP Gold Quarter',
    price: 499,
    period: 'for 3 months',
    savings: 'Save 20%',
    badge: null,
    description: 'Full VIP privileges for 90 days.',
  },
];

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { user, setUser, setNotification } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // default to annual
  const [step, setStep] = useState('select_plan'); // 'select_plan' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  
  // Payment Form State
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  if (!isOpen) return null;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!userEmail || !userEmail.includes('@')) {
      setPaymentError('Please enter a valid email address to associate with your subscription.');
      return;
    }
    setPaymentError('');
    setStep('payment');
  };

  const handlePayAndSubscribe = (e) => {
    e.preventDefault();
    setPaymentError('');

    if (paymentMethod === 'upi' && (!upiId.trim() || !upiId.includes('@'))) {
      setPaymentError('Please enter a valid UPI ID (e.g. username@gpay)');
      return;
    }

    if (paymentMethod === 'card' && (cardNumber.replace(/\s/g, '').length < 16 || !cardExpiry || !cardCvv)) {
      setPaymentError('Please enter complete card details (16-digit card, Expiry & CVV)');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      // Update user state with VIP status
      const updatedUser = {
        ...(user || { name: userEmail.split('@')[0], email: userEmail, role: 'customer' }),
        isVipSubscriber: true,
        vipPlan: selectedPlan.name,
        vipExpiry: new Date(Date.now() + (selectedPlan.id === 'annual' ? 365 : selectedPlan.id === 'quarterly' ? 90 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      };

      if (setUser) {
        setUser(updatedUser);
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('vip_subscription', JSON.stringify({
        plan: selectedPlan.name,
        amount: selectedPlan.price,
        subscribedAt: new Date().toISOString(),
        paymentMethod: paymentMethod.toUpperCase(),
      }));

      if (setNotification) {
        setNotification(`🎉 Payment of ₹${selectedPlan.price} successful! VIP Subscription active.`);
      }
    }, 1500);
  };

  const handleResetAndClose = () => {
    setStep('select_plan');
    setIsProcessing(false);
    setPaymentError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5">
                <span>NexusMart VIP Prime</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full uppercase">Paid Pass</span>
              </h2>
              <p className="text-xs text-slate-500">Unlock Premium Discounts & Free Express Shipping</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
            ⚠️ {paymentError}
          </div>
        )}

        {/* STEP 1: Select Plan */}
        {step === 'select_plan' && (
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subscriber Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.name@domain.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Plan Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Choose Subscription Tier</label>
              {plans.map((p) => {
                const isSelected = selectedPlan.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                        {p.badge}
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">{p.name}</h4>
                          {p.savings && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              {p.savings}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{p.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-indigo-600">₹{p.price}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{p.period}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIP Perks */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">VIP Member Privileges:</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Free Express Shipping</strong> on all orders (₹0 minimum)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Extra 10% Cashback/Discount</strong> auto-applied at checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Early Access</strong> to Flash Deals & Priority Support</span>
                </li>
              </ul>
            </div>

            {/* Proceed to Payment CTA */}
            <button
              onClick={handleProceedToPayment}
              className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 w-full rounded-xl inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Pay ₹{selectedPlan.price}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Payment Gateway */}
        {step === 'payment' && (
          <form onSubmit={handlePayAndSubscribe} className="space-y-5">
            {/* Amount Summary */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Selected Subscription</span>
                <h4 className="font-extrabold text-sm text-slate-900">{selectedPlan.name} ({selectedPlan.period})</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block">Total Amount</span>
                <span className="text-xl font-black text-indigo-600">₹{selectedPlan.price}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'netbanking' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Dynamic Form Inputs based on paymentMethod */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <label className="font-bold text-slate-800 block">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobileNumber@gpay / username@ybl"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
                <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM supported</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">16-Digit Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8912"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">CVV Security</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <label className="font-bold text-slate-800 block">Select Your Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Back & Pay Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('select_plan')}
                disabled={isProcessing}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>{isProcessing ? 'Processing Payment...' : `Pay ₹${selectedPlan.price} & Activate`}</span>
              </button>
            </div>

            <div className="text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Bank-Grade SSL Encrypted Payment Gateway</span>
            </div>
          </form>
        )}

        {/* STEP 3: Success Confirmation Ticket */}
        {step === 'success' && (
          <div className="text-center space-y-5 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-4 border-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-600">Your VIP Subscription has been activated for <strong className="text-slate-900">{userEmail}</strong></p>
            </div>

            {/* Subscription Pass Ticket */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl text-left space-y-3 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="w-24 h-24 text-amber-400" />
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block">NexusMart VIP Pass</span>
                  <h4 className="font-extrabold text-sm">{selectedPlan.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                  <span className="font-black text-amber-400 text-base">₹{selectedPlan.price}</span>
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-400 uppercase text-[11px]">ACTIVE VIP MEMBER</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Ref:</span>
                  <span className="font-mono text-[11px]">PAY_VIP_{Date.now().toString().slice(-8)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 w-full rounded-xl transition cursor-pointer"
            >
              Start Enjoying VIP Perks
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SubscriptionModal;
