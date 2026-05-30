import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

// Layouts & Guards
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PrivateRoute } from './components/guards/PrivateRoute';
import { PublicRoute } from './components/guards/PublicRoute';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyAccount } from './pages/auth/VerifyAccount';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';

function App() {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-account" element={<VerifyAccount />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Private Main Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
