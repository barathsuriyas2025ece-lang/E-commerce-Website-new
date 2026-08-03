import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (e) {
      localStorage.removeItem('wishlist');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!product) return;
    const targetId = product._id || product.id;
    if (!targetId) return;

    setWishlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === targetId);
      if (exists) {
        return prev.filter((p) => (p._id || p.id) !== targetId);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some((p) => (p._id || p.id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
