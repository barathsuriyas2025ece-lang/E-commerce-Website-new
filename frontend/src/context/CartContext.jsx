import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (e) {
      localStorage.removeItem('cartItems');
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [stockAlert, setStockAlert] = useState(null);
  const [deliverySettings, setDeliverySettings] = useState({
    isFreeDeliveryAll: true, // Default: Admin free delivery granted
    freeShippingThreshold: 499,
    standardShippingFee: 49,
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getDeliverySettings();
        if (res.data?.success && res.data?.settings) {
          setDeliverySettings(res.data.settings);
        }
      } catch (err) {
        console.error('Error loading delivery settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate dynamic delivery fee based on Admin Settings
  const isFreeShipping = deliverySettings.isFreeDeliveryAll || subtotal >= (deliverySettings.freeShippingThreshold || 499);
  const shippingPrice = subtotal === 0 ? 0 : (isFreeShipping ? 0 : (deliverySettings.standardShippingFee || 49));

  // Logical fix: Automatically clear applied coupon if subtotal falls below minimum purchase requirement
  useEffect(() => {
    if (appliedCoupon && (subtotal < (appliedCoupon.minPurchaseAmount || 0) || cartItems.length === 0)) {
      setAppliedCoupon(null);
    }
  }, [subtotal, appliedCoupon, cartItems.length]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return false;
    const pId = (product._id || product.id || '').toString();

    const maxStock = product.stock !== undefined
      ? product.stock
      : (product.countInStock !== undefined ? product.countInStock : 10);

    if (maxStock <= 0) {
      setStockAlert(`Sorry, "${product.name}" is currently Out of Stock!`);
      setTimeout(() => setStockAlert(null), 3500);
      return false;
    }

    let capped = false;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => (item._id || item.id || '').toString() === pId);
      const currentQty = existing ? existing.quantity : 0;
      const desiredQty = currentQty + quantity;

      if (desiredQty > maxStock) {
        capped = true;
        const addable = Math.max(1, maxStock);
        if (existing) {
          return prevItems.map((item) =>
            (item._id || item.id || '').toString() === pId ? { ...item, quantity: addable, stock: maxStock } : item
          );
        }
        return [...prevItems, { ...product, quantity: addable, stock: maxStock }];
      }

      if (existing) {
        return prevItems.map((item) =>
          (item._id || item.id || '').toString() === pId ? { ...item, quantity: desiredQty, stock: maxStock } : item
        );
      }
      return [...prevItems, { ...product, quantity: desiredQty, stock: maxStock }];
    });

    if (capped) {
      setStockAlert(`Only ${maxStock} units available in inventory for "${product.name}". Cart updated to maximum available stock.`);
      setTimeout(() => setStockAlert(null), 4000);
    }

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    const targetStr = productId.toString();
    setCartItems((prevItems) => prevItems.filter((item) => (item._id || item.id || '').toString() !== targetStr));
  };

  const updateQuantity = (productId, newQty) => {
    if (!productId) return;
    const targetStr = productId.toString();

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item._id || item.id || '').toString() === targetStr) {
          const maxStock = item.stock !== undefined
            ? item.stock
            : (item.countInStock !== undefined ? item.countInStock : 10);

          if (newQty > maxStock) {
            setStockAlert(`Only ${maxStock} units available in stock for "${item.name}".`);
            setTimeout(() => setStockAlert(null), 3500);
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const discountAmount = appliedCoupon ? Math.min((subtotal * appliedCoupon.discountPercentage) / 100, 5000) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + tax + shippingPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        setAppliedCoupon,
        stockAlert,
        subtotal,
        discountAmount,
        tax,
        shippingPrice,
        isFreeShipping,
        deliverySettings,
        setDeliverySettings,
        total,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

