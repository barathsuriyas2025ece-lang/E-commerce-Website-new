import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Package, Tag, Sparkles, Shield, ShoppingCart, Bell, CheckCircle2, AlertCircle } from 'lucide-react';

const NotificationContext = createContext();

const initialNotifications = [
  { id: 1, title: '📦 Order #TRK-98471203 Shipped!', subtitle: 'In transit via Express Logistics', time: 'Just now', iconType: 'package', read: false },
  { id: 2, title: '🔥 Flash Sale Active', subtitle: '20% off all laptops with code SAVE10', time: '12m ago', iconType: 'tag', read: false },
  { id: 3, title: '🤖 AI Shopping Assistant Active', subtitle: 'Natural voice & search commands enabled', time: '1h ago', iconType: 'sparkles', read: true },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeToast, setActiveToast] = useState(null);
  const [hasUnreadPulse, setHasUnreadPulse] = useState(true);

  // Helper to add a real-time notification
  const addNotification = useCallback(({ title, subtitle, type = 'info' }) => {
    const newNotif = {
      id: Date.now(),
      title,
      subtitle: subtitle || 'NexusMart Realtime Event System',
      time: 'Just now',
      type,
      iconType: type === 'order' ? 'package' : type === 'cart' ? 'cart' : type === 'promo' ? 'tag' : 'sparkles',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setHasUnreadPulse(true);

    // Auto-dismiss live toast after 4 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotif.id ? null : current));
    }, 4000);
  }, []);

  // Real-time periodic live notification simulation while user browses
  useEffect(() => {
    const realtimeEvents = [
      { title: '⚡ Flash Discount Alert', subtitle: 'Exclusive 15% price drop on Sony Headphones', type: 'promo' },
      { title: '📦 Real-Time Order Tracking', subtitle: 'Driver is 5 mins away with your delivery', type: 'order' },
      { title: '🛡️ Account Security Verified', subtitle: 'Session encrypted with 256-bit SSL', type: 'info' },
      { title: '🎉 Recommended Deal for You', subtitle: 'MacBook Air M3 Pro Edition back in stock', type: 'promo' },
    ];

    let eventIdx = 0;
    const interval = setInterval(() => {
      const event = realtimeEvents[eventIdx % realtimeEvents.length];
      addNotification(event);
      eventIdx++;
    }, 35000); // Trigger live notification every 35s

    return () => clearInterval(interval);
  }, [addNotification]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasUnreadPulse(false);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        clearNotification,
        unreadCount,
        hasUnreadPulse,
        activeToast,
        setActiveToast,
      }}
    >
      {children}

      {/* 🚀 Floating Real-Time Live Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full glass-panel p-4 rounded-2xl bg-slate-900/95 text-white border border-indigo-500/40 shadow-2xl animate-slide-up flex items-start gap-3 backdrop-blur-xl">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
            {activeToast.iconType === 'package' ? (
              <Package className="w-5 h-5" />
            ) : activeToast.iconType === 'cart' ? (
              <ShoppingCart className="w-5 h-5" />
            ) : activeToast.iconType === 'tag' ? (
              <Tag className="w-5 h-5 text-amber-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                REALTIME EVENT
              </span>
              <span className="text-[10px] text-slate-400">{activeToast.time}</span>
            </div>
            <h4 className="font-extrabold text-xs text-white mt-1 leading-snug">{activeToast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 truncate">{activeToast.subtitle}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
