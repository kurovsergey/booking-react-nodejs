import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="text-center text-sm">
        <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
        <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </form>
  );
};
