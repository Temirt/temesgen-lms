import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BookOpen,
  Users,
  Award,
  Star,
  CheckSquare,
  PlusCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Rocket,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function InstructorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/instructor/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading instructor studio..." />;

  const stats = data?.stats || {};
  const recentEnrollments = data?.recent_enrollments || [];
  const chartData = data?.chart_data || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/50 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>3 L's Pedagogical Studio</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Instructor Command Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage curriculum (Learn), foster mentorship & discussion (Link), and evaluate capstones (Lead).
          </p>
        </div>
        <Link
          to="/instructor/create-course"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#14213D] to-[#6C63FF] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 self-start"
        >
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {/* 3 L's Quick Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                1. LEARN Studio
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {stats.published_courses || 2} Published Courses
              </p>
            </div>
          </div>
          <Link
            to="/instructor/courses"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            Curriculum <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                2. LINK Hub
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {stats.unread_messages || 0} Messages • {stats.active_study_groups || 2} Circles
              </p>
            </div>
          </div>
          <Link
            to="/instructor/messages"
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            Mentorship <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                3. LEAD Center
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {stats.pending_project_evaluations || 0} Capstones to Grade
              </p>
            </div>
          </div>
          <Link
            to="/instructor/projects"
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
          >
            Grade Studio <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Courses"
          value={stats.total_courses || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Enrolled Students"
          value={stats.total_students || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completion_rate || 0}%`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Pending Submissions"
          value={stats.pending_submissions || 0}
          icon={CheckSquare}
          color="amber"
        />
      </div>

      {/* Charts & Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Student Enrollment Activity Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Enrollment Trend</h3>
            <span className="text-xs font-semibold text-slate-400">Past 6 Months</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [val, 'New Students']}
                  contentStyle={{ backgroundColor: '#14213D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="enrollments" stroke="#6C63FF" strokeWidth={3} fill="#6C63FF" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Instructor Actions & Pending Work */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Instructor Studio Tasks</h3>

          <div className="space-y-3">
            <Link
              to="/instructor/projects"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Real-World Capstone Evaluations
                  </span>
                  <span className="text-[10px] text-slate-400">Audit student code and award skill points</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </Link>

            <Link
              to="/instructor/submissions"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Review Course Assignments
                  </span>
                  <span className="text-[10px] text-slate-400">Regular unit homework submissions</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>

            <Link
              to="/instructor/messages"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Student Mentorship Messages
                  </span>
                  <span className="text-[10px] text-slate-400">Answer 1-on-1 student inquiries</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
