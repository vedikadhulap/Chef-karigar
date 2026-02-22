
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, ArrowRight, ShieldCheck, Badge, Users, TrendingUp, PieChart } from 'lucide-react';
import { APP_NAME } from '../constants';
import { AgencyRole } from '../types';
import toast from 'react-hot-toast';

export const AgencyLoginView: React.FC = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<AgencyRole>('SUPPORT');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Employee ID format: CK-ADMIN-XXXX (4 digits)
    const empIdPattern = /^CK-ADMIN-\d{4}$/;
    if (!empIdPattern.test(employeeId.trim())) {
      toast.error('Employee ID must be in format CK-ADMIN-XXXX (e.g. CK-ADMIN-8821)');
      return;
    }

    setIsLoading(true);
    
    // Simulate API authentication delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Set auth token and role
      localStorage.setItem('authToken', 'agency-token-' + Date.now());
      localStorage.setItem('userRole', 'AGENCY');
      localStorage.setItem('agencyRole', selectedRole);
      
      toast.success(`Welcome to ${selectedRole} Dashboard!`);
      
      // Navigate to agency dashboard with role
      navigate(`/agency/${selectedRole.toLowerCase()}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 h-full min-h-[600px]">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-indigo-100/50 dark:ring-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30">
             <Building2 size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Agency Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Internal Access Only. Select your department role.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
             {/* Role Selection */}
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department / Role</label>
               <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('SUPPORT')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition ${selectedRole === 'SUPPORT' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                      <Users size={20} /> Support / HR
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('SALES')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition ${selectedRole === 'SALES' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                      <TrendingUp size={20} /> Sales/Operations
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('FINANCE')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition ${selectedRole === 'FINANCE' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                      <PieChart size={20} /> Finance / Mgr
                  </button>
               </div>
             </div>

            <div>
              <label htmlFor="empId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Badge size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="empId"
                  name="empId"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="e.g. CK-ADMIN-8821"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-80 disabled:cursor-wait"
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
               <span className="flex items-center gap-2">Secure Login <ArrowRight size={18} /></span>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
             <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                Authorized Personnel Only. Activity is Monitored.
             </div>
        </div>
      </div>
    </div>
  );
};
