import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  Users,
  BookOpen,
  UserCheck,
  CreditCard,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  History,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling executive administrative analytics..." />;
  }

  const stats = data?.stats || {};
  const chartData = data?.chart_data || [];
  const recentUsers = data?.recent_users || [];
  const recentEnrollments = data?.recent_enrollments || [];
  const recentActivities = data?.recent_activities || [];
  const popularCourses = data?.popular_courses || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] tracking-tight">Platform Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform metrics, enrollment health, and system-wide revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/courses"
            className="px-4 py-2 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors"
          >
            Manage Courses
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={stats.total_students || 0}
          icon={Users}
          change="+18%"
          color="blue"
        />
        <StatCard
          title="Instructors"
          value={stats.total_instructors || 0}
          icon={UserCheck}
          change="+4%"
          color="purple"
        />
        <StatCard
          title="Total Courses"
          value={stats.total_courses || 0}
          icon={BookOpen}
          color="navy"
        />
        <StatCard
          title="Active Courses"
          value={stats.active_courses || 0}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.total_enrollments || 0}
          icon={Award}
          change="+24%"
          color="amber"
        />
        <StatCard
          title="Revenue (ETB)"
          value={`${Number(stats.total_revenue || 0).toLocaleString()}`}
          icon={CreditCard}
          change="+32%"
          color="emerald"
        />
      </div>

      {/* 3 L's Educational Framework System Health */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
              Platform Architecture
            </span>
            <h2 className="text-lg font-black tracking-tight">
              3 L's Educational Framework Ledger
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            System-Wide Performance & Activity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* LEARN */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 1. LEARN (Acquire)
              </span>
              <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xl font-black text-white">
              {stats.three_ls?.learn?.courses || stats.active_courses || 4} Courses
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>{stats.three_ls?.learn?.learning_paths || 4} Career Pathways</span>
              <span>{stats.three_ls?.learn?.lessons || 5} Lessons</span>
            </div>
          </div>

          {/* LINK */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> 2. LINK (Connect)
              </span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                Engaged
              </span>
            </div>
            <p className="text-xl font-black text-white">
              {stats.three_ls?.link?.study_groups || 2} Study Circles
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>{stats.three_ls?.link?.discussions || 3} Forum Threads</span>
              <span>{stats.three_ls?.link?.messages || 3} Mentorship Chats</span>
            </div>
          </div>

          {/* LEAD */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> 3. LEAD (Demonstrate)
              </span>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                Graduated
              </span>
            </div>
            <p className="text-xl font-black text-white">
              {stats.three_ls?.lead?.real_world_projects || 2} Industry Capstones
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>{stats.three_ls?.lead?.badges_awarded || 6} Badges Conferred</span>
              <span>{stats.three_ls?.lead?.certificates || 1} Verified Certs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#14213D]">Revenue Analytics</h3>
              <p className="text-xs text-slate-400">Monthly gross volume in ETB</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Verified Payments
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [`${val.toLocaleString()} ETB`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#14213D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6C63FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Student Enrollments Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#14213D]">Enrollment Trend</h3>
              <p className="text-xs text-slate-400">Student signups & course joins</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [val, 'Students']}
                  contentStyle={{ backgroundColor: '#14213D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="students" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Popular Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Courses */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#14213D]">Most Popular Courses</h3>
            <Link to="/admin/courses" className="text-xs font-bold text-[#6C63FF] hover:underline">
              View All Courses →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {popularCourses.map((c) => (
              <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-12 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#14213D] truncate">{c.title}</h4>
                    <span className="text-[11px] text-slate-400">{c.instructor?.name} • {c.category?.name}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-[#14213D]">
                    {c.enrollments_count || 0} Enrolled
                  </span>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    {c.is_free ? 'Free' : `${Number(c.price).toLocaleString()} ETB`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Logs */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#14213D]">Recent System Activity</h3>
            <Link to="/admin/logs" className="text-xs font-bold text-[#6C63FF] hover:underline">
              Full Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#6C63FF] text-[10px]">
                    {act.action}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{act.description}</p>
                {act.user && (
                  <span className="text-[10px] text-slate-400 block pt-0.5">By {act.user.name} ({act.user.role})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
