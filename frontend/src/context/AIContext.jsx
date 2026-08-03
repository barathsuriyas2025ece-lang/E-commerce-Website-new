import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm your AI Shopping Assistant. Ask me to find products under your budget, compare items, track your order, or apply promo coupons!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCompareItems, setActiveCompareItems] = useState(null);
  const [aiSearchResults, setAiSearchResults] = useState(null);

  const { addToCart, setAppliedCoupon } = useCart();
  const { toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const sendMessage = async (userText, productsCatalog = [], userOrders = []) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiAPI.query({
        message: userText,
        context: { currentPage: window.location.pathname },
        products: productsCatalog,
        orders: userOrders,
      });

      if (res.data.success) {
        const { text, action, products, compareData } = res.data;

        // Execute dynamic action commands returned by backend AI
        if (action) {
          switch (action.type) {
            case 'SEARCH_PRODUCTS':
              if (products && products.length > 0) {
                setAiSearchResults(products);
              }
              break;
            case 'COMPARE_PRODUCTS':
              if (compareData || action.payload?.items) {
                setActiveCompareItems(compareData || action.payload.items);
              }
              break;
            case 'ADD_TO_CART':
              if (action.payload?.product) {
                addToCart(action.payload.product);
              }
              break;
            case 'APPLY_COUPON':
              if (action.payload?.code) {
                setAppliedCoupon({
                  code: action.payload.code,
                  discountPercentage: action.payload.discountPercentage || 10,
                });
              }
              break;
            case 'REDIRECT_CHECKOUT':
              navigate('/checkout');
              setIsAiOpen(false);
              break;
            default:
              break;
          }
        }

        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text,
          action,
          products: products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I'm having trouble reaching the AI server right now, but you can browse our catalog directly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isAiOpen,
        setIsAiOpen,
        loading,
        sendMessage,
        activeCompareItems,
        setActiveCompareItems,
        aiSearchResults,
        setAiSearchResults,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
