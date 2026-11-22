import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, LogOut, LayoutDashboard, User, ShieldCheck } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'instructor') return '/instructor';
    return '/student';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#14213D] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#14213D] block leading-none">
                Temesgen <span className="text-[#6C63FF]">LMS</span>
              </span>
              <span className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">
                Learn. Grow. Achieve.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-600 hover:text-[#14213D] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-600 hover:text-[#14213D] transition-colors"
            >
              Courses
            </Link>
            <Link
              to="/about"
              className="text-sm font-semibold text-slate-600 hover:text-[#14213D] transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-sm font-semibold text-slate-600 hover:text-[#14213D] transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/verify-certificate"
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#6C63FF]/10 hover:text-[#6C63FF] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Verify Certificate
            </Link>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />

                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#6C63FF]" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-[#14213D] px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#14213D] to-[#1e3a8a] text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-110 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#6C63FF]"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#6C63FF]"
          >
            Courses
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#6C63FF]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#6C63FF]"
          >
            Contact
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#6C63FF]"
          >
            Verify Certificate
          </Link>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
