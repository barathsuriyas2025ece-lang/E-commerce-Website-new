import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Package, Tag, Sparkles, ShoppingCart, CheckCircle2, BellRing, Info } from 'lucide-react';

const NotificationContext = createContext();

const initialNotifications = [
  { id: 1, title: 'Store Update: New Arrival', subtitle: 'MacBook Air M3 Edition now available', time: 'Today', iconType: 'package', read: false },
  { id: 2, title: 'Price Drop Alert', subtitle: 'Special 15% discount on Sony Headphones', time: 'Yesterday', iconType: 'tag', read: true },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nexusmart_notifications');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : initialNotifications;
    } catch (e) {
      return initialNotifications;
    }
  });

  const [activeToast, setActiveToast] = useState(null);
  const toastRef = useRef(null);
  const [hasUnreadPulse, setHasUnreadPulse] = useState(() => notifications.some((n) => !n.read));

  useEffect(() => {
    const handleClickOutsideToast = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        setActiveToast(null);
      }
    };

    if (activeToast) {
      document.addEventListener('mousedown', handleClickOutsideToast);
      document.addEventListener('touchstart', handleClickOutsideToast);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideToast);
      document.removeEventListener('touchstart', handleClickOutsideToast);
    };
  }, [activeToast]);

  useEffect(() => {
    try {
      localStorage.setItem('nexusmart_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Real-time notification trigger method (Invoked strictly upon real admin/user actions)
  const addNotification = useCallback(({ title, subtitle, type = 'info' }) => {
    const newNotif = {
      id: Date.now(),
      title,
      subtitle: subtitle || 'Store Update',
      time: 'Just now',
      type,
      iconType: type === 'order' ? 'package' : type === 'cart' ? 'cart' : type === 'promo' ? 'tag' : 'info',
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

      {/* 🌟 Simple, Professional Floating Real-Time Toast */}
      {activeToast && (
        <div ref={toastRef} className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-slate-200 text-slate-900 p-4 rounded-2xl shadow-2xl animate-slide-up flex items-start gap-3 border-l-4 border-l-indigo-600">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            {activeToast.iconType === 'package' ? (
              <Package className="w-4 h-4" />
            ) : activeToast.iconType === 'tag' ? (
              <Tag className="w-4 h-4 text-amber-600" />
            ) : (
              <BellRing className="w-4 h-4 text-indigo-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                STORE NOTIFICATION
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{activeToast.time}</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">{activeToast.title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{activeToast.subtitle}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-slate-700 p-1 transition cursor-pointer text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
