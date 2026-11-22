import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  Layers,
  Award,
  CheckCircle,
  Clock,
  PlayCircle,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

export default function StudentProgress() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments/my');
      setEnrollments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Calculating your learning progress..." />;
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => (e.progress_percentage || 0) >= 100).length;
  const inProgressCourses = totalCourses - completedCourses;
  const overallAvg =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / totalCourses
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Learning Progress & Milestones
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Comprehensive breakdown of course completion, modules finished, and certificates earned.
        </p>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Overall Completion</div>
            <div className="text-2xl font-extrabold text-navy-900 dark:text-white">
              {overallAvg}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Completed Courses</div>
            <div className="text-2xl font-extrabold text-navy-900 dark:text-white">
              {completedCourses} / {totalCourses}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Courses In Progress</div>
            <div className="text-2xl font-extrabold text-navy-900 dark:text-white">
              {inProgressCourses}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Course-by-Course Progress List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white">
          Enrolled Programs Progress
        </h2>

        {enrollments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
              No active learning progress
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Enroll in a course to start tracking your module progression.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enr) => {
              const c = enr.course;
              if (!c) return null;
              const progress = enr.progress_percentage || 0;
              const isCompleted = progress >= 100;

              return (
                <div
                  key={enr.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={
                        c.thumbnail ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={c.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase text-primary">
                          {c.category?.name || 'Curriculum'}
                        </span>
                        {isCompleted ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <Badge variant="info">In Progress</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-navy-900 dark:text-white line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Enrolled on {new Date(enr.enrollment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Gauge & CTA */}
                  <div className="flex items-center gap-6 w-full md:w-80">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Completion</span>
                        <span className="font-bold text-navy-900 dark:text-white">{progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-primary'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/learn/${c.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm shrink-0 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {isCompleted ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
