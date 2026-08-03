import React from 'react';
import { Award, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const currentUser = user || {
    name: 'Registered User',
    email: 'user@store.com',
    phone: 'Not provided',
    role: 'customer',
    loyaltyPoints: 0,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="w-24 h-24 rounded-full border-4 border-indigo-600 mx-auto overflow-hidden shadow-md">
          <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Profile" className="w-full h-full object-cover" />
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

      <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs bg-white border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Details</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-700 font-medium"><Mail className="w-4 h-4 text-indigo-600" /><span>{currentUser.email}</span></div>
          <div className="flex items-center gap-3 text-slate-700 font-medium"><Phone className="w-4 h-4 text-indigo-600" /><span>{currentUser.phone || '+91 9876543210'}</span></div>
          <div className="flex items-center gap-3 text-slate-700 font-medium"><MapPin className="w-4 h-4 text-indigo-600" /><span>101 Innovation Way, Bengaluru, India</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
