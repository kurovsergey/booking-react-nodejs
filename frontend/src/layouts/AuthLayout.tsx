import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors duration-200 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white font-bold text-xl mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Coworking Space
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
            Booking & Real-time Analytics Platform
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
