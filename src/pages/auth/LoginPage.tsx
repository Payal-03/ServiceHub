import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Wrench, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('customer@servicehub.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both your registered email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success', 'Logged In');

      // Role-based redirect
      const from = (location.state as any)?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedUser.role === 'PROVIDER') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
            SERVICE<span className="text-primary-600">HUB</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-neutral-500">
          Access your bookings, service schedule, or admin workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/90 shadow-card">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-neutral-600 font-medium">Remember this device</span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-md shadow-primary-600/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block text-center mb-3">
              One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('customer@servicehub.com')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  email === 'customer@servicehub.com'
                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 font-bold'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="text-[11px] block">Customer</span>
                <span className="text-[9px] text-neutral-400">Payal</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('provider@servicehub.com')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  email === 'provider@servicehub.com'
                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 font-bold'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="text-[11px] block">Provider</span>
                <span className="text-[9px] text-neutral-400">Raj Kumar</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('admin@servicehub.com')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  email === 'admin@servicehub.com'
                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 font-bold'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="text-[11px] block">Admin</span>
                <span className="text-[9px] text-neutral-400">Ayush</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
