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
      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/60 inline-block mb-1">
              Restricted System Portal
            </span>
            <h1 className="text-2xl font-extrabold text-white">Admin Access Login</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your admin security password to unlock control panel</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-xl font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl font-medium flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs relative z-10">
          <div>
            <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Security Passcode</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin password (e.g. barath12345)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm shadow-inner transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white font-extrabold text-sm py-3.5 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/30"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>{loading ? 'Verifying Passcode...' : 'Unlock Admin Panel'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400 relative z-10">
          <Link to="/login" className="hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Login</span>
          </Link>
          <Link to="/" className="hover:text-indigo-300 font-medium transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
