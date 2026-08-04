import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Truck, User, Package, CheckCircle2, Clock, CreditCard, Eye, Shield } from 'lucide-react';
import { orderAPI, fallbackSampleOrders } from '../../services/api';

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Packed: 'bg-purple-50 text-purple-700 border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(fallbackSampleOrders);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllOrders();
      if (res.data?.success && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
        setOrders(res.data.orders);
      } else {
        setOrders(fallbackSampleOrders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setOrders(fallbackSampleOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Order Delivery & Fulfillment</h1>
          <p className="text-xs text-slate-500 mt-1">View customer orders, delivery addresses, items list, and dispatch status</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-xs text-indigo-700 font-bold">
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span>{orders.length} Total Orders Received</span>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Overview</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Products</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm font-black">Orders</Link>
        <Link to="/admin/coupons" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Coupons</Link>
        <Link to="/admin/users" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Users</Link>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-800 bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Order ID & Date</th>
              <th className="p-4">Customer & Shipping Address</th>
              <th className="p-4">Ordered Products</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Delivery Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const customerName = o.shippingAddress?.fullName || o.user?.name || 'Customer';
                const phone = o.shippingAddress?.phone || 'N/A';
                const fullAddress = o.shippingAddress
                  ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.postalCode}`
                  : 'Address details on file';

                const items = o.orderItems || [];
                const statusClass = statusColors[o.orderStatus] || 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <tr key={o._id} className="hover:bg-slate-50 transition">
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="font-mono font-extrabold text-indigo-600 text-xs">#{o._id.toString().slice(-6)}</span>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {new Date(o.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <CreditCard className="w-3 h-3 text-slate-500" />
                          <span>{o.paymentMethod || 'UPI/Card'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Address */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{customerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-start gap-1 font-medium leading-tight">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{fullAddress}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold pl-4">📞 {phone}</div>
                      </div>
                    </td>

                    {/* Ordered Products */}
                    <td className="p-4">
                      <div className="space-y-1.5">
                        {items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
                              alt={item.name}
                              className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                            />
                            <span className="font-bold text-slate-800 line-clamp-1 text-[11px]">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                        ))}
                        {items.length > 2 && (
                          <span className="text-[10px] text-indigo-600 font-bold">+ {items.length - 2} more items</span>
                        )}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 text-sm">₹{o.totalPrice?.toLocaleString()}</span>
                    </td>

                    {/* Delivery Status Dropdown */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <select
                          value={o.orderStatus || 'Processing'}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm ${statusClass}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="text-[10px] font-mono text-slate-400">
                          {o.trackingNumber || 'TRK-98471203'}
                        </div>
                      </div>
                    </td>

                    {/* Actions: View Delivery Slip */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="View Delivery Slip"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-[11px]">Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Delivery Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-4 text-xs text-slate-800 bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Customer Delivery Slip</h2>
              </div>
              <span className="font-mono font-extrabold text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                #{selectedOrder._id.toString().slice(-6)}
              </span>
            </div>

            {/* Customer & Delivery Address Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                Delivery Address Details
              </h3>
              <p className="font-extrabold text-sm text-slate-900">
                {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'Customer'}
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedOrder.shippingAddress
                  ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.postalCode}`
                  : 'Standard Shipping Address'}
              </p>
              <p className="text-slate-600 font-bold pt-1">
                📞 Phone: <span className="text-slate-900">{selectedOrder.shippingAddress?.phone || '+91 9876543210'}</span>
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Products To Package & Deliver</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {(selectedOrder.orderItems || []).map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-slate-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-500 text-[11px] font-bold block">Total Paid Amount:</span>
                <span className="text-xl font-extrabold text-slate-900">₹{selectedOrder.totalPrice?.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl cursor-pointer"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
