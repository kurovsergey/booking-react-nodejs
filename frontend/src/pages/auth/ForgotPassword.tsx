import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import toast from 'react-hot-toast';

export const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await client.post('/auth/forgot-password', { email: data.email });
      toast.success('Reset link logged to console!');
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset link sent!</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We've printed the password reset link to the backend console logs. Please check there to continue.
        </p>
        <Link to="/login" className="block text-primary-600 dark:text-primary-400 hover:underline font-semibold text-sm">
          Return to Login
        </Link>
      </div>
    );
  }

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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Sending...' : 'Send reset link'}
      </button>

      <div className="text-center text-sm">
        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
          Back to Login
        </Link>
      </div>
    </form>
  );
};
