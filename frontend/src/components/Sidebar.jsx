import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  UserCheck,
  CreditCard,
  HelpCircle,
  FileText,
  Award,
  Megaphone,
  BarChart3,
  History,
  Settings,
  LogOut,
  PlusCircle,
  GraduationCap,
  Layers,
  Video,
  CheckSquare,
  Bell,
  User,
  Compass,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Nav menus based on role
  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Courses', path: '/admin/courses', icon: BookOpen },
        { label: 'Categories', path: '/admin/categories', icon: FolderTree },
        { label: 'Enrollments', path: '/admin/enrollments', icon: UserCheck },
        { label: 'Payments', path: '/admin/payments', icon: CreditCard },
        { label: 'Quizzes', path: '/admin/quizzes', icon: HelpCircle },
        { label: 'Assignments', path: '/admin/assignments', icon: FileText },
        { label: 'Certificates', path: '/admin/certificates', icon: Award },
        { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
        { label: 'Activity Logs', path: '/admin/logs', icon: History },
        { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        { label: 'Dashboard', path: '/instructor', icon: LayoutDashboard, end: true },
        { label: 'My Courses', path: '/instructor/courses', icon: BookOpen },
        { label: 'Create Course', path: '/instructor/create-course', icon: PlusCircle },
        { label: 'Enrolled Students', path: '/instructor/students', icon: GraduationCap },
        { label: 'Modules & Lessons', path: '/instructor/modules', icon: Layers },
        { label: 'Quizzes', path: '/instructor/quizzes', icon: HelpCircle },
        { label: 'Assignments', path: '/instructor/assignments', icon: FileText },
        { label: 'Student Submissions', path: '/instructor/submissions', icon: CheckSquare },
        { label: 'Announcements', path: '/instructor/announcements', icon: Megaphone },
        { label: 'Course Analytics', path: '/instructor/analytics', icon: BarChart3 },
        { label: 'Profile & Bio', path: '/instructor/profile', icon: User },
      ];
    }

    // Default to student
    return [
      { label: 'Dashboard', path: '/student', icon: LayoutDashboard, end: true },
      { label: 'Explore Courses', path: '/courses', icon: Compass },
      { label: 'My Enrolled Courses', path: '/student/courses', icon: BookOpen },
      { label: 'Learning Progress', path: '/student/progress', icon: Layers },
      { label: 'Assignments', path: '/student/assignments', icon: FileText },
      { label: 'Quizzes & Tests', path: '/student/quizzes', icon: HelpCircle },
      { label: 'My Certificates', path: '/student/certificates', icon: Award },
      { label: 'Notifications', path: '/student/notifications', icon: Bell },
      { label: 'Profile & Settings', path: '/student/profile', icon: User },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#14213D] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#3B82F6] flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight block leading-none">
                  Temesgen <span className="text-[#6C63FF]">LMS</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                  {user?.role} Portal
                </span>
              </div>
            </Link>
          </div>

          {/* User Preview */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/20"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-xs font-bold transition-colors border border-white/5 hover:border-rose-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
