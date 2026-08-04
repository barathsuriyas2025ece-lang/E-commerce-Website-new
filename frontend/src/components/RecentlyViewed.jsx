import React from 'react';
import ProductCard from './ProductCard';
import { History, Sparkles } from 'lucide-react';

const RecentlyViewed = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4 pt-10 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-none">Recently Viewed Products</h2>
            <p className="text-xs text-slate-400 pt-0.5">Pick up right where you left off</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
