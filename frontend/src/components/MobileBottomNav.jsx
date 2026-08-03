import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Orders', path: '/orders', icon: Package },
    { label: 'Account', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition relative ${
                isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
