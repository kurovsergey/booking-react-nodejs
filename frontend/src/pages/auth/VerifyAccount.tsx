import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import client from '../../api/client';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const VerifyAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      client.get(`/auth/verify-account?token=${token}`)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Verifying account</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we activate your account...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activation complete!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your account has been successfully verified.</p>
          <Link
            to="/login"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors mt-2"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="h-14 w-14 text-red-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verification failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">The verification link is invalid or has expired.</p>
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold text-sm mt-2">
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
};
