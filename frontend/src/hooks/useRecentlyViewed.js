import { useState, useEffect, useCallback } from 'react';

const RECENTLY_VIEWED_KEY = 'nexus_recently_viewed';
const MAX_RECENT_ITEMS = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load recently viewed products', e);
    }
  }, []);

  const addRecentlyViewed = useCallback((product) => {
    if (!product || (!product._id && !product.id)) return;

    setRecentlyViewed((prev) => {
      const pId = product._id || product.id;
      const filtered = prev.filter((item) => (item._id || item.id) !== pId);
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);

      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed product', e);
      }
      return updated;
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed };
};
