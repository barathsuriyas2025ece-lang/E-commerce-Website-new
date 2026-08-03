import React, { useState } from 'react';
import { Bell, Tag, Package, Sparkles, ShoppingCart, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearNotification, hasUnreadPulse } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition cursor-pointer"
        title="Real-Time Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <>
            {hasUnreadPulse && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 rounded-full w-4 h-4 animate-ping opacity-75" />
            )}
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 max-w-sm w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 text-slate-800 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Real-Time Alerts</h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 font-medium">
                No active notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-xl text-xs transition border ${
                    n.read
                      ? 'bg-slate-50 border-slate-100 opacity-80'
                      : 'bg-indigo-50/60 border-indigo-200/70 font-semibold shadow-sm'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    {n.iconType === 'package' ? (
                      <Package className="w-4 h-4" />
                    ) : n.iconType === 'cart' ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : n.iconType === 'tag' ? (
                      <Tag className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5 truncate">{n.subtitle}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(n.id);
                    }}
                    className="text-slate-300 hover:text-red-500 p-1 transition"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
