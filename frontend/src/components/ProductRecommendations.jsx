import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productAPI, fallbackSampleProducts } from '../services/api';
import { Sparkles, TrendingUp, ShoppingBag, Layers } from 'lucide-react';

const ProductRecommendations = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('similar'); // 'similar', 'frequently_bought', 'trending'
  const [loading, setLoading] = useState(true);

  const productId = currentProduct?._id || currentProduct?.id;

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      if (!productId) {
        setRecommendations(fallbackSampleProducts.slice(0, 4));
        setLoading(false);
        return;
      }

      try {
        const res = await productAPI.getRecommendations(productId);
        if (res.data && res.data.success && Array.isArray(res.data.recommendations) && res.data.recommendations.length > 0) {
          setRecommendations(res.data.recommendations);
        } else {
          setRecommendations(
            fallbackSampleProducts.filter((p) => (p._id || p.id).toString() !== productId.toString()).slice(0, 4)
          );
        }
      } catch (err) {
        setRecommendations(
          fallbackSampleProducts.filter((p) => (p._id || p.id).toString() !== productId.toString()).slice(0, 4)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  // Tab filtering logic
  const getTabProducts = () => {
    if (activeTab === 'frequently_bought') {
      return recommendations.slice(0, 3);
    }
    if (activeTab === 'trending') {
      return [...recommendations].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5)).slice(0, 4);
    }
    return recommendations.slice(0, 4);
  };

  const displayedProducts = getTabProducts();

  return (
    <div className="space-y-6 pt-12 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Multi-Source Recommendations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">You Might Also Like</h2>
        </div>

        {/* Tab Selectors */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('similar')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'similar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Similar Items</span>
          </button>
          <button
            onClick={() => setActiveTab('frequently_bought')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'frequently_bought' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Frequently Bought</span>
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'trending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trending Now</span>
          </button>
        </div>
      </div>

      {/* Grid Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          No recommendation items found for this tab.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((prod) => (
            <ProductCard key={prod._id || prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
