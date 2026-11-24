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
  CheckSquare,
  Bell,
  User,
  Compass,
  MessageSquare,
  Rocket,
  TrendingUp,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderStudentNav = () => (
    <>
      <NavLink
        to="/student"
        end
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <LayoutDashboard className="w-4 h-4 shrink-0" />
        <span>Dashboard Overview</span>
      </NavLink>

      {/* 1. LEARN PRINCIPLE */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-3 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" />
          <span>1. LEARN</span>
        </span>
      </div>
      <NavLink
        to="/student/courses"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-[#6C63FF]/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <BookOpen className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>My Enrolled Courses</span>
      </NavLink>
      <NavLink
        to="/student/learning-paths"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-[#6C63FF]/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Compass className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>Personalized Paths</span>
      </NavLink>
      <NavLink
        to="/student/quizzes"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-[#6C63FF]/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <HelpCircle className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>Quizzes & Tests</span>
      </NavLink>

      {/* 2. LINK PRINCIPLE */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-3 flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          <span>2. LINK</span>
        </span>
      </div>
      <NavLink
        to="/student/messages"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-emerald-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Direct Messages</span>
      </NavLink>
      <NavLink
        to="/student/discussions"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-emerald-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Course Forums</span>
      </NavLink>
      <NavLink
        to="/student/study-groups"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-emerald-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Users className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Study Groups</span>
      </NavLink>
      <NavLink
        to="/student/notifications"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-emerald-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Bell className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Notifications</span>
      </NavLink>

      {/* 3. LEAD PRINCIPLE */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-3 flex items-center gap-1.5">
          <Rocket className="w-3 h-3" />
          <span>3. LEAD</span>
        </span>
      </div>
      <NavLink
        to="/student/projects"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Rocket className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Real-World Projects</span>
      </NavLink>
      <NavLink
        to="/student/assignments"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <FileText className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Assignments</span>
      </NavLink>
      <NavLink
        to="/student/skills"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <TrendingUp className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Skill Development</span>
      </NavLink>
      <NavLink
        to="/student/badges"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Award className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Badges & Honors</span>
      </NavLink>
      <NavLink
        to="/student/certificates"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isActive ? 'bg-amber-600/30 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <GraduationCap className="w-4 h-4 shrink-0 text-amber-400" />
        <span>My Certificates</span>
      </NavLink>

      {/* Account */}
      <div className="pt-3 pb-1 border-t border-white/5">
        <NavLink
          to="/student/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <User className="w-4 h-4 shrink-0" />
          <span>Profile & Settings</span>
        </NavLink>
      </div>
    </>
  );

  const renderInstructorNav = () => (
    <>
      <NavLink
        to="/instructor"
        end
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <LayoutDashboard className="w-4 h-4 shrink-0" />
        <span>Instructor Studio</span>
      </NavLink>

      {/* 1. LEARN Studio */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-3 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" />
          <span>1. LEARN Studio</span>
        </span>
      </div>
      <NavLink
        to="/instructor/courses"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-[#6C63FF]/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <BookOpen className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>My Courses</span>
      </NavLink>
      <NavLink
        to="/instructor/create-course"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-[#6C63FF]/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <PlusCircle className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>6-Step Course Wizard</span>
      </NavLink>
      <NavLink
        to="/instructor/modules"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-[#6C63FF]/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Layers className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>Modules & Lessons</span>
      </NavLink>
      <NavLink
        to="/instructor/quizzes"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-[#6C63FF]/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <HelpCircle className="w-4 h-4 shrink-0 text-indigo-400" />
        <span>Quiz Creator</span>
      </NavLink>

      {/* 2. LINK Hub */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-3 flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          <span>2. LINK Hub</span>
        </span>
      </div>
      <NavLink
        to="/instructor/messages"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-emerald-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Student Mentorship</span>
      </NavLink>
      <NavLink
        to="/instructor/discussions"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-emerald-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Course Forums</span>
      </NavLink>
      <NavLink
        to="/instructor/study-groups"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-emerald-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Users className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Study Groups</span>
      </NavLink>
      <NavLink
        to="/instructor/announcements"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-emerald-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Megaphone className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Announcements</span>
      </NavLink>

      {/* 3. LEAD Center */}
      <div className="pt-3 pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-3 flex items-center gap-1.5">
          <Rocket className="w-3 h-3" />
          <span>3. LEAD Center</span>
        </span>
      </div>
      <NavLink
        to="/instructor/projects"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-amber-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Rocket className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Capstone Grading</span>
      </NavLink>
      <NavLink
        to="/instructor/submissions"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-amber-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <CheckSquare className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Assignment Grading</span>
      </NavLink>
      <NavLink
        to="/instructor/students"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-amber-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <GraduationCap className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Student Roster</span>
      </NavLink>
      <NavLink
        to="/instructor/analytics"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-amber-600/30 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <BarChart3 className="w-4 h-4 shrink-0 text-amber-400" />
        <span>Course Analytics</span>
      </NavLink>
    </>
  );

  const renderAdminNav = () => (
    <>
      <NavLink
        to="/admin"
        end
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
            isActive
              ? 'bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] text-white shadow-md'
              : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <LayoutDashboard className="w-4 h-4 shrink-0" />
        <span>Executive Dashboard</span>
      </NavLink>
      <NavLink
        to="/admin/users"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Users className="w-4 h-4 shrink-0" />
        <span>User Management</span>
      </NavLink>
      <NavLink
        to="/admin/courses"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <BookOpen className="w-4 h-4 shrink-0" />
        <span>Course Moderation</span>
      </NavLink>
      <NavLink
        to="/admin/categories"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <FolderTree className="w-4 h-4 shrink-0" />
        <span>Category Taxonomy</span>
      </NavLink>
      <NavLink
        to="/admin/enrollments"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <UserCheck className="w-4 h-4 shrink-0" />
        <span>Enrollments</span>
      </NavLink>
      <NavLink
        to="/admin/payments"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <CreditCard className="w-4 h-4 shrink-0" />
        <span>Financial Ledger</span>
      </NavLink>
      <NavLink
        to="/admin/certificates"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Award className="w-4 h-4 shrink-0" />
        <span>Certificates Issued</span>
      </NavLink>
      <NavLink
        to="/admin/announcements"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Megaphone className="w-4 h-4 shrink-0" />
        <span>Announcements</span>
      </NavLink>
      <NavLink
        to="/admin/reports"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <BarChart3 className="w-4 h-4 shrink-0" />
        <span>System Analytics</span>
      </NavLink>
      <NavLink
        to="/admin/logs"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <History className="w-4 h-4 shrink-0" />
        <span>Activity Audit Logs</span>
      </NavLink>
      <NavLink
        to="/admin/settings"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
          }`
        }
      >
        <Settings className="w-4 h-4 shrink-0" />
        <span>Platform Settings</span>
      </NavLink>
    </>
  );

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
          <div className="p-3.5 mx-3 my-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover border border-white/20"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Links with Scroll */}
          <nav className="px-3 py-1 space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {user?.role === 'admin'
              ? renderAdminNav()
              : user?.role === 'instructor'
              ? renderInstructorNav()
              : renderStudentNav()}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-white/10 bg-black/10">
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
