import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AIProvider } from './context/AIContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingAI from './widgets/FloatingAI';
import CompareProducts from './comparison/CompareProducts';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransitionWrapper from './components/PageTransitionWrapper';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import DownloadApp from './pages/DownloadApp';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminCoupons from './pages/admin/Coupons';
import AdminLogin from './pages/AdminLogin';
import { WifiOff } from 'lucide-react';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <AIProvider>
                    <NotificationProvider>
                      <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-600 selection:text-white bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                        {/* Offline Status Warning Bar */}
                        {isOffline && (
                          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 z-50 sticky top-0">
                            <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
                            <span>You are currently offline. Showing cached content & features.</span>
                          </div>
                        )}

                        <Navbar />

                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
                          <PageTransitionWrapper>
                            <Routes>
                              {/* Customer Routes */}
                              <Route path="/" element={<Home />} />
                              <Route path="/shop" element={<Shop />} />
                              <Route path="/product/:id" element={<Product />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/orders" element={<Orders />} />
                              <Route path="/wishlist" element={<Wishlist />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/careers" element={<Careers />} />
                              <Route path="/privacy" element={<Privacy />} />
                              <Route path="/terms" element={<Terms />} />
                              <Route path="/download-app" element={<DownloadApp />} />

                              {/* Admin Routes */}
                              <Route path="/admin/login" element={<AdminLogin />} />
                              <Route path="/admin/dashboard" element={<AdminDashboard />} />
                              <Route path="/admin/products" element={<AdminProducts />} />
                              <Route path="/admin/orders" element={<AdminOrders />} />
                              <Route path="/admin/users" element={<AdminUsers />} />
                              <Route path="/admin/coupons" element={<AdminCoupons />} />
                            </Routes>
                          </PageTransitionWrapper>
                        </main>

                        {/* Instant Slide-over Cart Drawer */}
                        <CartDrawer />

                        {/* Persistent Floating AI Assistant on every page */}
                        <FloatingAI />

                        {/* Interactive Product Comparison Modal */}
                        <CompareProducts />

                        {/* Mobile Bottom Navigation Bar */}
                        <MobileBottomNav />

                        <Footer />
                      </div>
                    </NotificationProvider>
                  </AIProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
