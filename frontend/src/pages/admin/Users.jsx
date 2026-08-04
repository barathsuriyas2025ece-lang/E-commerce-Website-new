import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Award, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user } = useAuth();

  const users = [
    {
      _id: user?.id || 'u1',
      name: user?.name || 'Barath Suriya (Admin)',
      email: user?.email || 'barathsuriya.s2025ece@sece.ac.in',
      role: 'admin',
      points: user?.loyaltyPoints || 1000,
    },
    {
      _id: 'u2',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      role: 'customer',
      points: 250,
    },
    {
      _id: 'u3',
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      role: 'customer',
      points: 480,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">User & Customer Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage registered customer accounts, loyalty point balances, and access roles</p>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Overview</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Products</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Orders</Link>
        <Link to="/admin/coupons" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Coupons</Link>
        <Link to="/admin/users" className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm font-black">Users</Link>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-800 bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Account Role</th>
              <th className="p-4">Loyalty Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`badge ${u.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 font-extrabold text-emerald-700">
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{u.points} pts</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
