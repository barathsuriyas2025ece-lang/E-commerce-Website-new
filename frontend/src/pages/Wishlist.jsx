import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="space-y-8 pb-16">
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-600 fill-current" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Wishlist</h1>
          <p className="text-sm text-slate-500">Saved products to purchase later or monitor price drops.</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500 space-y-2 bg-white border border-slate-200">
          <p className="text-base font-bold text-slate-800">Your wishlist is empty.</p>
          <p className="text-xs text-slate-500">Click the heart icon on any product to save it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
