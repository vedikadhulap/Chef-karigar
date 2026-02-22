import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../constants';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
          Access Your Portal
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Select your role to continue to the {APP_NAME} ecosystem.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
        <button 
          onClick={() => navigate('/business/login')} 
          className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-600 transition-all text-left group"
        >
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">I am a Business</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Hire professional staff and manage your restaurant workforce.
          </p>
          <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm flex items-center gap-1">
            Login <ArrowRight size={16}/>
          </span>
        </button>

        <button 
          onClick={() => navigate('/staff/login')} 
          className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all text-left group"
        >
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
            <User size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">I am a Chef</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Find jobs, track your shifts, and manage your profile.
          </p>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-1">
            Login <ArrowRight size={16}/>
          </span>
        </button>

        <button 
          onClick={() => navigate('/sales/dashboard')} 
          className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left group"
        >
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sales Partner</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Refer staff and businesses to earn commissions.
          </p>
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1">
            Enter Dashboard <ArrowRight size={16}/>
          </span>
        </button>
      </div>

      <div className="mt-12">
        <button 
          onClick={() => navigate('/agency/login')} 
          className="text-slate-400 dark:text-slate-500 text-sm hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-2 transition"
        >
          <Building2 size={14} /> Agency Admin Login
        </button>
      </div>
    </div>
  );
};
