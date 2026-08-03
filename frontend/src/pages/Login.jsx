import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const validateEmail = (emailStr) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(emailStr).toLowerCase().trim());
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    const cleanEmail = email.trim().toLowerCase();

    // Strict Email Format Validation
    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g., name@domain.com)');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }

    const res = await login(cleanEmail, password);
    if (res.success) {
      setSuccessNotice(`📧 Professional security alert email dispatched to ${cleanEmail}`);
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1000);
    } else {
      setError(res.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6">
      <div className="glass-panel p-8 rounded-3xl space-y-6 bg-white border border-slate-200 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Sign In</h1>
          <p className="text-xs text-slate-500">Enter your email and password below</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-bold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@domain.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold w-full justify-center text-sm py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <LogIn className="w-4 h-4 text-white" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 flex flex-col gap-2">
          <div>
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
          </div>
          <div className="pt-2">
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-700 font-semibold bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-slate-200 transition">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Panel Login (Passcode Only)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
