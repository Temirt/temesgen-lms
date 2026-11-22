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
  ArrowRight
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
          <h1 className="text-2xl font-extrabold text-[#14213D]">Instructor Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor student engagement, review assignment submissions, and publish new lectures.
          </p>
        </div>
        <Link
          to="/instructor/create-course"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#14213D] to-[#6C63FF] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 self-start"
        >
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
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
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#14213D]">Student Enrollment Trend</h3>
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
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#14213D]">Instructor Tasks</h3>

          <div className="space-y-3">
            <Link
              to="/instructor/submissions"
              className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between hover:bg-amber-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Grade Student Submissions</h4>
                  <p className="text-[11px] text-amber-700">{stats.pending_submissions || 0} submissions awaiting your feedback</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </Link>

            <Link
              to="/instructor/modules"
              className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between hover:bg-indigo-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#6C63FF]" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Curriculum & Video Lessons</h4>
                  <p className="text-[11px] text-indigo-700">Add lessons, video streams, or PDF attachments</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-700" />
            </Link>

            <Link
              to="/instructor/announcements"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-slate-700" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Post Course Announcement</h4>
                  <p className="text-[11px] text-slate-500">Broadcast updates to your students</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Enrolled Students */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#14213D]">Recent Course Enrollments</h3>
          <Link to="/instructor/students" className="text-xs font-bold text-[#6C63FF] hover:underline">
            View All Students →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentEnrollments.map((enr) => (
            <div key={enr.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={enr.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt={enr.user?.name}
                  className="w-9 h-9 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-[#14213D]">{enr.user?.name}</p>
                  <span className="text-[11px] text-slate-400">Enrolled in {enr.course?.title}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(enr.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
