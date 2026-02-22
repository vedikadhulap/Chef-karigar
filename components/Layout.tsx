import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { APP_NAME } from '../constants';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    // Clear any auth tokens/state here
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700',
          duration: 3000,
          style: {
            borderRadius: '1rem',
            padding: '16px',
            fontWeight: '600'
          }
        }}
      />
      
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <ChefHat size={28} className="text-orange-500" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">Chef-Karigar</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLandingPage && (
               <button 
                 onClick={handleLogout} 
                 className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors shadow-sm"
               >
                 Logout
               </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}. Delivering right staff, every time!
         </div>
      </footer>
    </div>
  );
};
