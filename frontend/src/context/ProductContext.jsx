import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { productAPI } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      _id: '650000000000000000000001',
      name: 'MacBook Air M3 Pro Edition',
      description: 'Ultra-thin, blistering performance with Apple M3 chip, 16GB Unified Memory, 512GB SSD.',
      price: 114900,
      originalPrice: 129900,
      category: 'Electronics & Laptops',
      brand: 'Apple',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      isFeatured: true,
      rating: 4.9,
      numReviews: 48,
    },
    {
      _id: '650000000000000000000002',
      name: 'Asus ROG Strix Gaming Laptop',
      description: 'NVIDIA GeForce RTX 4060, Intel Core i7-13650HX, 16GB DDR5, 1TB SSD.',
      price: 68990,
      originalPrice: 79990,
      category: 'Electronics & Laptops',
      brand: 'ASUS',
      stock: 4,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      isFeatured: true,
      rating: 4.7,
      numReviews: 32,
    },
    {
      _id: '650000000000000000000003',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry-leading noise canceling with two processors, 30-hour battery life.',
      price: 26990,
      originalPrice: 34990,
      category: 'Audio & Wearables',
      brand: 'Sony',
      stock: 25,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      isFeatured: true,
      rating: 4.8,
      numReviews: 89,
    },
    {
      _id: '650000000000000000000004',
      name: 'Nike ZoomX Vaporfly Running Shoes',
      description: 'Engineered for marathons and fast road racing with responsive carbon fiber plate.',
      price: 2899,
      originalPrice: 4999,
      category: 'Apparel & Footwear',
      brand: 'Nike',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      isFeatured: true,
      rating: 4.6,
      numReviews: 64,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const refreshProducts = async () => {
    try {
      const res = await productAPI.getProducts({});
      if (res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('Product refresh fallback:', err?.message);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set((p._id || p.id || '').toString(), p));
    return map;
  }, [products]);

  const getProductById = (id) => {
    if (!id) return null;
    const lookupKey = typeof id === 'string' ? id : id.toString();
    return productMap.get(lookupKey) || products.find((product) => (product._id || product.id || '').toString() === lookupKey) || null;
  };

  // Real-time State Mutation Handlers for Admin Operations
  const addProductToState = (newProduct) => {
    if (!newProduct) return;
    setProducts((prev) => [newProduct, ...prev.filter((p) => (p._id || p.id || '').toString() !== (newProduct._id || newProduct.id || '').toString())]);
  };

  const updateProductInState = (updatedProduct) => {
    if (!updatedProduct) return;
    const targetId = (updatedProduct._id || updatedProduct.id || '').toString();
    setProducts((prev) =>
      prev.map((p) => ((p._id || p.id || '').toString() === targetId ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProductFromState = (productId) => {
    if (!productId) return;
    const targetId = productId.toString();
    setProducts((prev) => prev.filter((p) => (p._id || p.id || '').toString() !== targetId));
  };

  const deductStock = (orderItems = []) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const prodId = (prod._id || prod.id || '').toString();
        const match = orderItems.find((item) => {
          const itemId = (item.product || item._id || item.id || '').toString();
          return itemId === prodId;
        });

        if (match) {
          const currentStock = prod.stock !== undefined ? prod.stock : (prod.countInStock || 10);
          const newStock = Math.max(0, currentStock - match.quantity);
          return {
            ...prod,
            stock: newStock,
            countInStock: newStock,
          };
        }
        return prod;
      })
    );
  };

  const addOrUpdateReview = async (productId, { rating, comment, user }) => {
    try {
      await productAPI.addReview(productId, { rating, comment });
    } catch (err) {}

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if ((p._id || p.id || '').toString() === productId.toString()) {
          const currentReviews = p.reviews ? [...p.reviews] : [];
          const userIdStr = (user?.id || user?._id || 'u_guest').toString();
          const existingIndex = currentReviews.findIndex(
            (r) => r.user && r.user.toString() === userIdStr
          );

          const newReview = {
            _id: 'rev_' + Date.now(),
            user: userIdStr,
            userName: user?.name || user?.email?.split('@')[0] || 'Verified Buyer',
            rating: Number(rating),
            comment,
            createdAt: new Date().toISOString(),
          };

          if (existingIndex !== -1) {
            currentReviews[existingIndex] = newReview;
          } else {
            currentReviews.unshift(newReview);
          }

          const avgRating = Number(
            (currentReviews.reduce((acc, r) => acc + r.rating, 0) / currentReviews.length).toFixed(1)
          );

          return {
            ...p,
            reviews: currentReviews,
            numReviews: currentReviews.length,
            rating: avgRating,
          };
        }
        return p;
      })
    );
  };

  const deleteReview = async (productId, reviewId) => {
    try {
      await productAPI.deleteReview(productId, reviewId);
    } catch (err) {}

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if ((p._id || p.id || '').toString() === productId.toString()) {
          const currentReviews = (p.reviews || []).filter(
            (r) => r._id?.toString() !== reviewId?.toString()
          );
          const avgRating =
            currentReviews.length > 0
              ? Number(
                  (currentReviews.reduce((acc, r) => acc + r.rating, 0) / currentReviews.length).toFixed(1)
                )
              : 5;

          return {
            ...p,
            reviews: currentReviews,
            numReviews: currentReviews.length,
            rating: avgRating,
          };
        }
        return p;
      })
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        refreshProducts,
        getProductById,
        addProductToState,
        updateProductInState,
        deleteProductFromState,
        deductStock,
        addOrUpdateReview,
        deleteReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
