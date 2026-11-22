import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import NotificationDropdown from '../components/NotificationDropdown';
import { Menu, Search, Compass, ExternalLink } from 'lucide-react';

export default function DashboardLayout({ requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    // If user lacks required role, route to their own dashboard
    if (user?.role === 'instructor') return <Navigate to="/instructor" replace />;
    if (user?.role === 'student') return <Navigate to="/student" replace />;
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {user?.role?.toUpperCase()} DASHBOARD
              </span>
              <h2 className="text-base font-extrabold text-[#14213D] leading-none mt-0.5">
                Welcome back, {user?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#6C63FF]" />
              Browse Courses
            </Link>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#14213D] px-2 py-1"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <NotificationDropdown />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <span className="hidden md:inline text-xs font-bold text-slate-700">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
