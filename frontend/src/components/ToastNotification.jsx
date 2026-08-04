import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ToastNotification = ({ toast, onClose }) => {
  const { setIsCartOpen } = useCart();

  useEffect(() => {
    if (toast?.duration !== 0) {
      const timer = setTimeout(() => {
        onClose();
      }, toast?.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { product, title, message } = toast;

  return (
    <div
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-fadeIn flex items-center gap-3 backdrop-blur-md"
      role="alert"
    >
      {/* Product Image Thumbnail or Icon */}
      {product?.images?.[0] ? (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
          <span>{title || product?.name || 'Item added!'}</span>
        </div>
        <p className="text-[11px] text-slate-500 truncate pt-0.5">
          {message || 'Added to your shopping cart'}
        </p>
      </div>

      {/* CTA & Close */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => {
            setIsCartOpen(true);
            onClose();
          }}
          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
