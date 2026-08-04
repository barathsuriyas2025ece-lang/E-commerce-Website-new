import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, AlertTriangle, TrendingUp, Shield, Plus, ArrowRight, IndianRupee } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useProducts } from '../../context/ProductContext';

const Dashboard = () => {
  const { products } = useProducts();
  const [stats, setStats] = useState({
    totalRevenue: 284950,
    totalOrders: 42,
    totalProducts: 18,
    totalCustomers: 156,
    lowStockAlerts: 3,
    salesData: [
      { month: 'Jan', revenue: 35000 },
      { month: 'Feb', revenue: 48000 },
      { month: 'Mar', revenue: 62000 },
      { month: 'Apr', revenue: 54000 },
      { month: 'May', revenue: 85950 },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.data?.success && res.data.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      }
    };
    fetchStats();
  }, []);

  const lowStockProducts = (products || []).filter(
    (p) => (p.stock !== undefined ? p.stock : (p.countInStock || 10)) <= 5
  );

  const maxRevenue = Math.max(...stats.salesData.map((d) => d.revenue), 100000);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Analytics Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="btn-primary text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="btn-secondary text-xs py-2 px-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Fulfill Orders</span>
          </Link>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm font-black">Overview</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Products</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Orders</Link>
        <Link to="/admin/coupons" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Coupons</Link>
        <Link to="/admin/users" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Users</Link>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> +18.4% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-inner">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalOrders}</h3>
            <span className="text-[11px] text-indigo-700 font-bold mt-1">4 pending fulfillment</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-inner">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Catalog Products</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{products?.length || stats.totalProducts}</h3>
            <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> {lowStockProducts.length} low stock alerts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Registered Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalCustomers}</h3>
            <span className="text-[11px] text-emerald-700 font-bold mt-1">+12 new this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ⚠️ Low Stock Inventory Alert Widget */}
      {lowStockProducts.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-amber-950">Inventory Restock Needed ({lowStockProducts.length} Low / Out of Stock Items)</h2>
                <p className="text-xs text-amber-800">These items have 5 or fewer units remaining in store catalog</p>
              </div>
            </div>
            <Link to="/admin/products" className="btn-primary bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 px-3 rounded-xl flex items-center gap-1">
              <span>Restock Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStockProducts.map((prod) => {
              const currentStock = prod.stock !== undefined ? prod.stock : (prod.countInStock || 0);
              return (
                <div key={prod._id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-sm text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={prod.images?.[0]} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0" />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{prod.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md font-black text-[11px] shrink-0 ${
                    currentStock <= 0 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {currentStock <= 0 ? '🔴 0 (Out)' : `⚠️ ${currentStock} left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Revenue Bar Graph */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Monthly Revenue & Sales Breakdown</h2>
            <p className="text-xs text-slate-500">Track monthly revenue trends and sales volume</p>
          </div>
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-black px-3 py-1 rounded-xl">
            Total Year: ₹{stats.salesData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
          </span>
        </div>

        {/* Dynamic Bar Graph */}
        <div className="pt-6 pb-2">
          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-slate-200 bg-slate-50/50 rounded-2xl p-4">
            {stats.salesData.map((d, i) => {
              const heightPercent = Math.max(15, Math.round((d.revenue / maxRevenue) * 100));

              return (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group">
                  {/* Tooltip badge on hover / view */}
                  <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    ₹{(d.revenue / 1000).toFixed(1)}k
                  </span>

                  {/* Colored Gradient Bar */}
                  <div className="w-full max-w-[64px] bg-slate-200 rounded-t-xl overflow-hidden flex items-end h-[75%]">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 rounded-t-xl transition-all duration-700 shadow-md group-hover:from-indigo-700 group-hover:to-purple-600"
                    ></div>
                  </div>

                  {/* Month Label */}
                  <span className="text-xs text-slate-700 font-extrabold mt-3">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
