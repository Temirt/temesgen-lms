import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Compass,
  Layers,
  Cloud,
  Brain,
  Palette,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentLearningPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      const res = await api.get('/learning-paths');
      setPaths(res.data);
    } catch (err) {
      console.error('Error fetching learning paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (pathId) => {
    try {
      setEnrollingId(pathId);
      const res = await api.post(`/learning-paths/${pathId}/enroll`);
      setNotification({
        type: 'success',
        message: res.data.message || 'Successfully enrolled in learning path!',
      });
      fetchPaths();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to enroll in learning path.',
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Layers':
        return Layers;
      case 'Cloud':
        return Cloud;
      case 'Brain':
        return Brain;
      case 'Palette':
        return Palette;
      default:
        return Compass;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800/40',
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800/40',
        };
      case 'sky':
        return {
          gradient: 'from-sky-500 to-blue-600',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400',
          border: 'border-sky-200 dark:border-sky-800/40',
        };
      default:
        return {
          gradient: 'from-indigo-600 to-blue-600',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400',
          border: 'border-indigo-200 dark:border-indigo-800/40',
        };
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading personalized learning paths..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/50 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Principle 1: LEARN</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Personalized Learning Paths
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated, outcome-driven pathways with milestone courses designed to prepare you for senior industry roles.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-sm font-black">&times;</button>
        </div>
      )}

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paths.map((path) => {
          const Icon = getIcon(path.icon);
          const colors = getColorClasses(path.color);

          return (
            <div
              key={path.id}
              className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Progress */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                        {path.level}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {path.title}
                      </h3>
                    </div>
                  </div>

                  {path.is_enrolled && (
                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {path.progress_percentage}% Done
                      </span>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                        Active Track
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {path.description}
                </p>

                {/* Progress bar if enrolled */}
                {path.is_enrolled && (
                  <div className="mb-4">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                        style={{ width: `${path.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Career Target</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">
                        {path.career_role || 'Industry Specialist'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {path.estimated_weeks} Weeks • {path.courses_count} Courses
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outcomes list */}
                {path.outcomes && path.outcomes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Key Competencies You Will Acquire:
                    </h4>
                    <ul className="space-y-1.5">
                      {path.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Included Courses Preview */}
                {path.courses && path.courses.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mb-4">
                    <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Milestone Course Curriculum:
                    </h4>
                    <div className="space-y-2">
                      {path.courses.map((course, idx) => (
                        <Link
                          key={course.id}
                          to={`/courses/${course.slug || course.id}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all border border-transparent hover:border-indigo-200 group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">
                              {course.title}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {path.is_enrolled ? (
                  <Link
                    to={`/courses/${path.courses[0]?.id || 1}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <span>Continue Pathway</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(path.id)}
                    disabled={enrollingId === path.id}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{enrollingId === path.id ? 'Enrolling...' : 'Enroll in Career Path'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
