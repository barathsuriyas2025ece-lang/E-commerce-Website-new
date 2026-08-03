import React, { useState } from 'react';
import { Award, Mail, Phone, MapPin, Edit3, Save, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();

  const currentUser = user || {
    name: 'Barath Suriya',
    email: 'barathsuriya.12345@gmail.com',
    phone: '+91 9876543210',
    address: '101 Innovation Way, Bengaluru, India',
    role: 'customer',
    loyaltyPoints: 350,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '+91 9876543210',
    address: currentUser.address || '101 Innovation Way, Bengaluru, India',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    };

    if (setUser) {
      setUser(updatedUser);
    }
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    setSuccessMsg('🎉 Profile details updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const initialLetter = currentUser.name ? currentUser.name[0].toUpperCase() : 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Profile Header (No Image Avatar - Pure Initial Badge) */}
      <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden space-y-4 bg-white border border-slate-200 shadow-sm">
        {/* Initial Badge replacing image */}
        <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 border-4 border-white">
          {initialLetter}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
          <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase mt-1">
            {currentUser.role} Account
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Loyalty Rewards: {currentUser.loyaltyPoints || 350} Points</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Details & Interactive Edit Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Account Details</span>
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary py-1.5 px-3 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Account</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-bold">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold">Shipping Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-1 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full justify-center text-xs py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition cursor-pointer">
              <Save className="w-4 h-4 text-white" />
              <span>Save Account Changes</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-700"><Mail className="w-4 h-4 text-indigo-600 shrink-0" /><span>Email</span></div>
              <span className="font-bold text-slate-900">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-700"><Phone className="w-4 h-4 text-indigo-600 shrink-0" /><span>Phone</span></div>
              <span className="font-bold text-slate-900">{currentUser.phone || '+91 9876543210'}</span>
            </div>

            <div className="flex items-start justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-700"><MapPin className="w-4 h-4 text-indigo-600 shrink-0" /><span>Shipping Address</span></div>
              <span className="font-bold text-slate-900 text-right max-w-xs">{currentUser.address || '101 Innovation Way, Bengaluru, India'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
