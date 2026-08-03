import React from 'react';
import { X, CheckCircle, AlertCircle, ShoppingCart, Award } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useCart } from '../context/CartContext';

const CompareProducts = () => {
  const { activeCompareItems, setActiveCompareItems } = useAI();
  const { addToCart } = useCart();

  if (!activeCompareItems || activeCompareItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative bg-white border border-slate-200 shadow-2xl rounded-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">AI Product Comparison Matrix</h2>
          </div>
          <button
            onClick={() => setActiveCompareItems(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCompareItems.map((item, idx) => (
            <div key={item._id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                {/* Badge */}
                {idx === 0 && (
                  <span className="badge badge-featured mb-3">★ Top AI Recommendation</span>
                )}
                <div className="aspect-video overflow-hidden rounded-lg mb-4 bg-white border border-slate-200">
                  <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                <div className="text-2xl font-extrabold text-indigo-600 mb-4">₹{item.price?.toLocaleString()}</div>

                {/* Specs List */}
                <div className="space-y-2 text-xs border-t border-b border-slate-200 py-3 mb-4">
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Brand:</span><span className="font-bold text-slate-900">{item.brand || 'Generic'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Category:</span><span className="font-bold text-indigo-700">{item.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Rating:</span><span className="font-bold text-amber-600">★ {item.rating || 4.5}</span></div>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Advantages</h4>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(item.advantages || ['High build quality', 'Great performance', 'Vibrant screen display']).map((adv, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Drawbacks</h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(item.disadvantages || ['Premium pricing']).map((dis, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {dis}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(item);
                  setActiveCompareItems(null);
                }}
                className="btn-primary w-full justify-center text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Select & Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
