import React, { useEffect, Component } from 'react';
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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
          <div className="max-w-xl w-full glass-panel p-8 rounded-3xl bg-slate-800/90 border border-slate-700 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center mx-auto text-indigo-400 text-2xl font-extrabold">
              ⚡
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-white">NexusMart Diagnostics</h2>
              <div className="p-4 bg-red-950/80 border border-red-500/40 rounded-2xl text-red-200 font-mono text-xs text-left overflow-x-auto max-h-48 leading-relaxed">
                {this.state.error ? (this.state.error.stack || this.state.error.toString()) : 'Unknown Error Occurred'}
              </div>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="w-full btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 text-xs rounded-xl transition shadow-md cursor-pointer"
            >
              Reload Web Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
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
                        <Navbar />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
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
                        </main>

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/coupons" element={<AdminCoupons />} />
                          </Routes>
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
