import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedInUser.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(demoEmail, demoPassword);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedInUser.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#14213D] flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-6 h-6 text-[#6C63FF]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
            Sign In to Temesgen LMS
          </h2>
          <p className="text-xs text-slate-500">
            Welcome back! Please enter your account credentials.
          </p>
        </div>

        {/* Quick Demo Logins Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-2.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            ⚡ 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@temesgenlms.com', 'password123')}
              className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-[#14213D] hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('instructor@temesgenlms.com', 'password123')}
              className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-[#6C63FF] hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#6C63FF]" />
              Instructor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('student@temesgenlms.com', 'password123')}
              className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-[#3B82F6] hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#3B82F6]" />
              Student
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please use the quick demo login or reset via administrator.'); }} className="text-[11px] text-[#6C63FF] hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14213D] to-[#1e3a8a] text-white text-xs font-extrabold shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#6C63FF] hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
