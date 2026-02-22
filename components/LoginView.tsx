import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, User, ArrowRight, Store, Smartphone, MessageCircle } from 'lucide-react';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';
import toast from 'react-hot-toast';

interface LoginViewProps {
  role?: 'BUSINESS' | 'STAFF';
}

export const LoginView: React.FC<LoginViewProps> = ({ role = 'BUSINESS' }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isStaff = role === 'STAFF';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if(mobile.length < 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
    }
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        toast.success(`OTP sent to +91 ${mobile}`);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if(otp.length !== 4) {
        toast.error("Please enter a valid 4-digit OTP");
        return;
    }
    setIsLoading(true);
    
    // Simulate API authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Set auth token and role
      localStorage.setItem('authToken', 'dummy-token-' + Date.now());
      localStorage.setItem('userRole', role);
      
      toast.success(`Welcome to ${APP_NAME}!`);
      
      // Navigate to appropriate dashboard
      if (isStaff) {
        navigate('/staff/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 h-full min-h-[600px]">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ${isStaff ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-emerald-50/50 dark:ring-emerald-900/20' : 'bg-orange-50 dark:bg-orange-900/30 ring-orange-50/50 dark:ring-orange-900/20'}`}>
             {isStaff ? (
                 <ChefHat size={40} className="text-emerald-500" />
             ) : (
                 <Store size={40} className="text-orange-500" />
             )}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isStaff ? 'Chef/Karigar Login' : 'Business Login'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Welcome to {APP_NAME}. Please sign in with your mobile number to access your {isStaff ? 'profile' : 'dashboard'}.
          </p>
        </div>

        {step === 1 ? (
            <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div className="space-y-4">
                <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all shadow-sm ${isStaff ? 'focus:ring-emerald-500' : 'focus:ring-orange-500'}`}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setMobile(val);
                    }}
                    />
                </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-80 disabled:cursor-wait ${isStaff ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600' : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900'}`}
            >
                {isLoading ? 'Sending...' : <span className="flex items-center gap-2">Send OTP <ArrowRight size={18} /></span>}
            </button>
            </form>
        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="space-y-4">
                <div className="text-center mb-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Enter OTP sent to +91 {mobile}</span>
                    <button type="button" onClick={() => setStep(1)} className={`text-xs font-bold ml-2 hover:underline ${isStaff ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>Edit</button>
                </div>
                <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    One-Time Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageCircle size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all shadow-sm tracking-widest text-lg ${isStaff ? 'focus:ring-emerald-500' : 'focus:ring-orange-500'}`}
                    placeholder="XXXX"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 4) setOtp(val);
                    }}
                    />
                </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-80 disabled:cursor-wait ${isStaff ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600' : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-600'}`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">Verify & Login <ArrowRight size={18} /></span>
                )}
            </button>
            </form>
        )}
        
        <div className="mt-6 text-center">
             <p className="text-xs text-slate-400 dark:text-slate-500">
                Protected by <span className="font-semibold text-slate-500 dark:text-slate-400">{APP_NAME} Secure Access</span>
             </p>
        </div>
      </div>
    </div>
  );
};