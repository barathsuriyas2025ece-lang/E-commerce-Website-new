import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const { adminLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!password.trim()) {
      setError('Please enter the Admin Security Passcode');
      return;
    }

    const res = await adminLogin(password);
    if (res.success) {
      setSuccessNotice('🔑 Security Verification Authorized. Redirecting to Admin Dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 800);
    } else {
      setError(res.message || 'Invalid Admin Passcode. Access Denied.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 space-y-6">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 bg-white text-slate-900 border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Top Header Badge & Icon */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-indigo-200 border border-indigo-100">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block mb-1">
              Restricted System Portal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin Access Login</h1>
            <p className="text-xs text-slate-500 mt-1">Enter your admin security password to unlock control panel</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs relative z-10">
          <div>
            <label className="text-slate-800 font-bold block mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>Admin Security Passcode</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Enter Admin Security Passcode"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 font-mono text-sm transition shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm py-3.5 rounded-xl inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>{loading ? 'Verifying Passcode...' : 'Unlock Admin Panel'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center flex items-center justify-between text-xs text-slate-600 relative z-10">
          <Link to="/login" className="hover:text-indigo-600 font-bold inline-flex items-center gap-1 transition">
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customer Login</span>
          </Link>
          <Link to="/" className="hover:text-indigo-600 font-bold transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
