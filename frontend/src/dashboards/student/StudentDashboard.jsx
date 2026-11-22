import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  FileText,
  ArrowRight,
  Sparkles,
  Calendar,
  Compass,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your learning workspace..." />;
  }

  const stats = data?.stats || {
    enrolled_courses: 0,
    completed_courses: 0,
    learning_hours: 0,
    certificates_earned: 0,
  };

  const continueLearning = data?.continue_learning || [];
  const upcomingAssignments = data?.upcoming_assignments || [];
  const upcomingQuizzes = data?.upcoming_quizzes || [];
  const recommendedCourses = data?.recommended_courses || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-secondary-light">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Your Professional Journey
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Pick up where you left off. Keep building industry-recognized skills and earning verified certificates.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/student/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Go to My Courses
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm"
            >
              <Compass className="w-4 h-4" />
              Explore Catalog
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Enrolled Courses"
          value={stats.enrolled_courses}
          icon={BookOpen}
          color="primary"
          change="Active learning"
          isPositive={true}
        />
        <StatCard
          title="Completed"
          value={stats.completed_courses}
          icon={CheckCircle}
          color="emerald"
          change="Courses graduated"
          isPositive={true}
        />
        <StatCard
          title="Learning Hours"
          value={`${stats.learning_hours} hrs`}
          icon={Clock}
          color="amber"
          change="Total time invested"
          isPositive={true}
        />
        <StatCard
          title="Certificates"
          value={stats.certificates_earned}
          icon={Award}
          color="purple"
          change="Verified credentials"
          isPositive={true}
        />
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">
              Continue Learning
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Resume your recent courses right from where you stopped
            </p>
          </div>
          <Link
            to="/student/courses"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {continueLearning.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-8 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-navy-900 dark:text-white mb-1">
              You haven't enrolled in any courses yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Explore our wide variety of courses in technology, business, and design.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {continueLearning.map((enr) => {
              const c = enr.course;
              if (!c) return null;
              const progress = enr.progress_percentage || 0;

              return (
                <div
                  key={enr.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={
                        c.thumbnail ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={c.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {c.category?.name || 'Course'}
                      </span>
                      <h3 className="text-sm font-bold text-navy-900 dark:text-white line-clamp-2 mt-0.5 mb-1">
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>By {c.instructor?.name || 'Instructor'}</span>
                        <span>•</span>
                        <span>{c.lessons_count || 12} lessons</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Progress</span>
                      <span className="font-bold text-navy-900 dark:text-white">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link
                        to={`/learn/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {progress > 0 ? 'Resume Course' : 'Start Course'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Upcoming Quizzes & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-navy-900 dark:text-white text-base">
                    Upcoming Assignments
                  </h3>
                  <p className="text-xs text-slate-400">Tasks requiring your solution</p>
                </div>
              </div>
              <Link
                to="/student/assignments"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {upcomingAssignments.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                You're all caught up! No pending assignments.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-xs text-navy-900 dark:text-white line-clamp-1">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {a.course?.title}
                      </div>
                    </div>
                    <Link
                      to="/student/assignments"
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shrink-0"
                    >
                      Submit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-navy-900 dark:text-white text-base">
                    Tests & Knowledge Checks
                  </h3>
                  <p className="text-xs text-slate-400">Evaluate your comprehension</p>
                </div>
              </div>
              <Link
                to="/student/quizzes"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {upcomingQuizzes.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No active quizzes in your courses right now.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingQuizzes.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-xs text-navy-900 dark:text-white line-clamp-1">
                        {q.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{q.course?.title}</span>
                        <span>•</span>
                        <span>{q.duration_minutes} mins</span>
                      </div>
                    </div>
                    <Link
                      to={`/quiz/${q.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shrink-0"
                    >
                      Take Quiz
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expand your skills with these highly-rated programs
              </p>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={
                      c.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={c.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase text-primary">
                      {c.category?.name || 'Course'}
                    </span>
                    <h3 className="font-bold text-sm text-navy-900 dark:text-white line-clamp-2 mt-1 mb-2">
                      {c.title}
                    </h3>
                    <div className="text-xs text-slate-400">
                      Instructor: {c.instructor?.name || 'Dr. Temesgen'}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between mt-3">
                  <span className="font-bold text-navy-900 dark:text-white text-sm">
                    {Number(c.price) === 0 ? 'Free' : `${c.price} ETB`}
                  </span>
                  <Link
                    to={`/courses/${c.id}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
