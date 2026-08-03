import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
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
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Order Fulfillment Center</h1>
        <p className="text-xs text-slate-400">View customer orders, update tracking information, and process shipments</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Tracking Number</th>
              <th className="p-4">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-slate-900/40 transition">
                <td className="p-4 font-mono font-bold text-indigo-300">#{o._id.toString().slice(-6)}</td>
                <td className="p-4 font-semibold text-white">{o.shippingAddress?.fullName || 'Customer'}</td>
                <td className="p-4 font-bold text-slate-100">₹{o.totalPrice?.toLocaleString()}</td>
                <td className="p-4 font-mono text-amber-400">{o.trackingNumber || 'TRK-98471203'}</td>
                <td className="p-4">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-indigo-300"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
