import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';
import toast from 'react-hot-toast';

export const ResetPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error('Missing reset token');
      return;
    }
    setIsLoading(true);
    try {
      await client.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          New Password
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
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>

      <div className="text-center text-sm">
        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
          Cancel and return to Login
        </Link>
      </div>
    </form>
  );
};
