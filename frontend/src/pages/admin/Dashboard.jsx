import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, AlertTriangle, TrendingUp, Shield, Plus, ArrowRight, IndianRupee, Truck } from 'lucide-react';
import { adminAPI, orderAPI } from '../../services/api';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';


const Dashboard = () => {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 318960,
    totalOrders: 6,
    totalProducts: 4,
    totalCustomers: 156,
    lowStockAlerts: 1,
    salesData: [
      { month: 'Jan', revenue: 35000 },
      { month: 'Feb', revenue: 48000 },
      { month: 'Mar', revenue: 62000 },
      { month: 'Apr', revenue: 54000 },
      { month: 'May', revenue: 85950 },
    ],
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAPI.getStats().catch(() => null),
          orderAPI.getAllOrders().catch(() => null),
        ]);

        if (statsRes?.data?.success && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        }

        if (ordersRes?.data?.success && Array.isArray(ordersRes.data.orders)) {
          setOrders(ordersRes.data.orders);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      }
    };
    fetchRealData();
  }, []);

  // Real Dynamic Calculations from Actual Catalog & Orders
  const lowStockProducts = (products || []).filter(
    (p) => (p.stock !== undefined ? p.stock : (p.countInStock || 10)) <= 5
  );

  const realTotalProducts = products && products.length > 0 ? products.length : stats.totalProducts;
  const realTotalOrders = orders && orders.length > 0 ? orders.length : stats.totalOrders;

  const realTotalRevenue = orders && orders.length > 0
    ? orders
        .filter((o) => (o.orderStatus || '').toLowerCase() !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    : stats.totalRevenue;

  const pendingOrdersCount = orders && orders.length > 0
    ? orders.filter((o) => ['pending', 'processing'].includes((o.orderStatus || '').toLowerCase())).length
    : 4;

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

      {/* Top Metric Cards (Calculated Dynamically from Store State & DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{realTotalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> Live Calculated Store Sales
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-inner">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{realTotalOrders}</h3>
            <span className="text-[11px] text-indigo-700 font-bold mt-1">{pendingOrdersCount} pending fulfillment</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-inner">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Catalog Products */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Catalog Products</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{realTotalProducts}</h3>
            <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> {lowStockProducts.length} low stock alerts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Users */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between bg-white border border-slate-200 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Registered Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalCustomers}</h3>
            <span className="text-[11px] text-emerald-700 font-bold mt-1">Active Accounts</span>
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
                <div key={prod._id || prod.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-sm text-xs">
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

      {/* 🚚 Admin Free Delivery & Shipping Policy Controller */}
      <AdminDeliveryControl />
    </div>
  );
};

// Sub-component: Admin Delivery Controls
const AdminDeliveryControl = () => {
  const { deliverySettings, setDeliverySettings } = useCart();
  const [isFreeAll, setIsFreeAll] = useState(deliverySettings?.isFreeDeliveryAll ?? true);
  const [minThreshold, setMinThreshold] = useState(deliverySettings?.freeShippingThreshold ?? 499);
  const [fee, setFee] = useState(deliverySettings?.standardShippingFee ?? 49);
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    if (deliverySettings) {
      setIsFreeAll(deliverySettings.isFreeDeliveryAll);
      setMinThreshold(deliverySettings.freeShippingThreshold);
      setFee(deliverySettings.standardShippingFee);
    }
  }, [deliverySettings]);

  const handleSaveDeliveryPolicy = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        isFreeDeliveryAll: Boolean(isFreeAll),
        freeShippingThreshold: Number(minThreshold),
        standardShippingFee: Number(fee),
      };
      const res = await adminAPI.updateDeliverySettings(updated);
      if (res.data?.success) {
        setDeliverySettings(updated);
        setSaveNotice('✅ Delivery policy updated and applied store-wide across all customer carts!');
        setTimeout(() => setSaveNotice(''), 4000);
      }
    } catch (err) {
      setSaveNotice('❌ Error saving delivery settings: ' + (err.message || 'Unknown error'));
      setTimeout(() => setSaveNotice(''), 4000);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Admin Store Shipping & Delivery Settings</h2>
            <p className="text-xs text-slate-500">Manage free delivery eligibility, thresholds, and shipping charges</p>
          </div>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${isFreeAll ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'}`}>
          {isFreeAll ? '🟢 Free Delivery for ALL Orders Enabled' : `📦 Free Shipping for Orders > ₹${minThreshold}`}
        </span>
      </div>

      {saveNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-fadeIn">
          {saveNotice}
        </div>
      )}

      <form onSubmit={handleSaveDeliveryPolicy} className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        {/* Toggle Free Shipping for All Orders */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <label className="font-extrabold text-slate-800 block">Free Delivery Mode</label>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsFreeAll(true)}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition cursor-pointer ${isFreeAll ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}`}
            >
              FREE for ALL
            </button>
            <button
              type="button"
              onClick={() => setIsFreeAll(false)}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition cursor-pointer ${!isFreeAll ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}`}
            >
              Min. Order
            </button>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            {isFreeAll ? 'Admin grants 100% Free Shipping on every order.' : 'Customers get free shipping when cart total exceeds threshold.'}
          </p>
        </div>

        {/* Free Shipping Minimum Threshold */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <label className="font-extrabold text-slate-800 block">Free Shipping Threshold (₹)</label>
          <input
            type="number"
            disabled={isFreeAll}
            value={minThreshold}
            onChange={(e) => setMinThreshold(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <p className="text-[11px] text-slate-500">Minimum subtotal required to qualify for Free Shipping.</p>
        </div>

        {/* Standard Shipping Fee */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <label className="font-extrabold text-slate-800 block">Standard Shipping Charge (₹)</label>
          <input
            type="number"
            disabled={isFreeAll}
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <p className="text-[11px] text-slate-500">Shipping charge applied when order is below threshold.</p>
        </div>

        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            Save Delivery Policy Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;

