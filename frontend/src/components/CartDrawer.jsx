import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto text-slate-900 border-l border-slate-200">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart ({cartItems.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">Your cart is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200" />
                  
                  <div className="flex-1 truncate">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                    <p className="text-xs text-indigo-600 font-extrabold">₹{item.price?.toLocaleString()}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg text-xs">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-0.5 text-slate-700 font-bold hover:bg-slate-100">-</button>
                    <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-0.5 text-slate-700 font-bold hover:bg-slate-100">+</button>
                  </div>

                  <button onClick={() => removeFromCart(item._id)} className="p-1 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4 space-y-3 mt-4">
            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Subtotal:</span>
              <span className="text-indigo-600 text-base">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="btn-secondary flex-1 justify-center text-xs py-2.5"
              >
                View Full Cart
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn-primary flex-1 justify-center text-xs py-2.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
