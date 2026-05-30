import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Please check console for verification link.', { duration: 8000 });
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
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
        {isLoading ? 'Signing up...' : 'Sign up'}
      </button>

      <div className="text-center text-sm">
        <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </form>
  );
};
