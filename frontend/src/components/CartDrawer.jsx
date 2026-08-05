import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, deliverySettings } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = deliverySettings?.isFreeDeliveryAll ? 0 : (deliverySettings?.freeShippingThreshold || 499);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = FREE_SHIPPING_THRESHOLD === 0 ? 100 : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);


  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto text-slate-900 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 id="cart-drawer-title" className="text-base font-extrabold text-slate-900">
                Your Shopping Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cartItems.length > 0 && (
            <div className="mb-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-indigo-950">
                {remainingForFreeShipping > 0 ? (
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" /> Add ₹{remainingForFreeShipping.toLocaleString()} for <span className="text-indigo-600 uppercase tracking-wide">FREE Shipping!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You unlocked FREE Express Shipping!
                  </span>
                )}
                <span className="font-black text-indigo-600">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List / Smart Empty State */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center text-slate-600 space-y-4">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
                <ShoppingBag className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Your Cart is Waiting!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore thousands of premium products, flash sales, and trending deals.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Start Shopping</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition"
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate hover:text-indigo-600 transition">
                      {item.name}
                    </h4>
                    <p className="text-xs text-indigo-600 font-extrabold pt-0.5">
                      ₹{item.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl text-xs shadow-sm">
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-700 font-bold hover:bg-slate-100 transition rounded-l-xl"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-0.5 font-extrabold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-700 font-bold hover:bg-slate-100 transition rounded-r-xl"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id || item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4 space-y-3 mt-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span className="text-slate-600 font-medium text-xs">Subtotal:</span>
              <span className="text-indigo-600 text-lg font-black">₹{subtotal.toLocaleString()}</span>
            </div>

            {/* Trust Assurance Bar */}
            <div className="flex items-center justify-around text-[10px] font-semibold text-slate-500 py-1 border-y border-slate-100">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> 256-Bit SSL Secure
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Easy 30-Day Returns
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="btn-secondary flex-1 justify-center text-xs py-3 rounded-xl"
              >
                View Cart
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn-primary flex-1 justify-center text-xs py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
