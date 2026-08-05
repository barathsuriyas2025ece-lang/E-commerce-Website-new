import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Award, Mail, UserPlus, X, CheckCircle2, AlertCircle, Lock, ShieldCheck, Check, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const validateAdminPassword = (pwd) => {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
    hasSpecial: /[@$!%*?&#^()_+-=]/.test(pwd),
  };
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Register Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.data?.success && Array.isArray(res.data.users) && res.data.users.length > 0) {
        setUsers(res.data.users);
      } else if (currentUser) {
        setUsers([currentUser]);
      } else {
        setUsers([]);
      }
    } catch (err) {
      if (currentUser) {
        setUsers([currentUser]);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const pwdChecks = validateAdminPassword(adminPassword);
  const isPwdValid = Object.values(pwdChecks).every(Boolean);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!adminName.trim() || !adminEmail.trim() || !adminPassword || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (adminPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check your password confirmation.');
      return;
    }

    if (!isPwdValid) {
      setErrorMsg('Password does not meet all complexity requirements (8+ chars, uppercase, lowercase, number, special symbol).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await adminAPI.createAdmin({
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
      });

      if (res.data && res.data.success) {
        setSuccessMsg(`✅ ${res.data.message || `Admin account '${adminName}' created successfully!`}`);
        setAdminName('');
        setAdminEmail('');
        setAdminPassword('');
        setConfirmPassword('');
        await fetchUsers();
        setTimeout(() => {
          setShowAdminModal(false);
          setSuccessMsg('');
        }, 1500);
      } else if (res.status === 409 || res.data?.message?.includes('already exists')) {
        setErrorMsg('❌ An account with this email address already exists.');
      } else {
        setErrorMsg(`❌ ${res.data?.message || 'Failed to create admin account.'}`);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Error creating admin account';
      setErrorMsg(`❌ ${errMsg}`);
    } finally {
      setSubmitting(false);
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
          <h1 className="text-3xl font-extrabold text-slate-900">User & System Admin Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage registered accounts & create admin credentials ({users.length} Total Accounts)</p>
        </div>

        {/* Defense in Depth: Render button strictly if currentUser is admin */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setAdminName('');
              setAdminEmail('');
              setAdminPassword('');
              setConfirmPassword('');
              setShowAdminModal(true);
            }}
            className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Admin</span>
          </button>
        )}
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Overview</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Products</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Orders</Link>
        <Link to="/admin/coupons" className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900">Coupons</Link>
        <Link to="/admin/users" className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm font-black">Users</Link>
      </div>

      {/* Admin Registration Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Register New Admin</h3>
                  <p className="text-xs text-slate-500">Enterprise admin credential creation</p>
                </div>
              </div>
              <button
                disabled={submitting}
                onClick={() => setShowAdminModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold">Admin Full Name</label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="e.g., Sarah Connor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Admin Email Address</label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="admin@nexusmart.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Secure Admin Password</label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="e.g., Admin@123"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="Re-enter password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium disabled:opacity-60"
                  />
                </div>
                {confirmPassword && adminPassword !== confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Password Strength Checklist */}
              {adminPassword && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] space-y-1 font-medium">
                  <p className="font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                    <Info className="w-3 h-3 text-indigo-600" /> Password Security Checklist:
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-slate-600">
                    <span className={`flex items-center gap-1 ${pwdChecks.minLength ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {pwdChecks.minLength ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} 8+ Characters
                    </span>
                    <span className={`flex items-center gap-1 ${pwdChecks.hasUpper ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {pwdChecks.hasUpper ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} Uppercase Letter
                    </span>
                    <span className={`flex items-center gap-1 ${pwdChecks.hasLower ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {pwdChecks.hasLower ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} Lowercase Letter
                    </span>
                    <span className={`flex items-center gap-1 ${pwdChecks.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {pwdChecks.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} Number (0-9)
                    </span>
                    <span className={`flex items-center gap-1 col-span-2 ${pwdChecks.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {pwdChecks.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : '•'} Special Symbol (@$!%*?&#^()_-)
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowAdminModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isPwdValid || adminPassword !== confirmPassword}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{submitting ? 'Creating...' : 'Create Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table displaying real existing registered users */}
      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-800 bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Account Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Account Role</th>
              <th className="p-4">Loyalty Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Loading accounts...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No registered user accounts found in database.</td>
              </tr>
            ) : (
              users.map((u) => {
                const uId = u._id || u.id || u.email;
                const roleName = u.role || 'customer';
                return (
                  <tr key={uId} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{u.name || u.email?.split('@')[0] || 'User'}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${roleName === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                        {roleName === 'admin' && <ShieldCheck className="w-3 h-3 text-amber-600" />}
                        {roleName.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-700">
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{u.loyaltyPoints !== undefined ? u.loyaltyPoints : (u.points || 100)} pts</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
