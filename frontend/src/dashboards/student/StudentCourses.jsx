import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  BookOpen,
  Search,
  Filter,
  PlayCircle,
  Award,
  CheckCircle,
  Clock,
  Layers,
  Compass,
} from 'lucide-react';

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
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

  const filtered = enrollments.filter((enr) => {
    const courseTitle = enr.course?.title || '';
    const instructorName = enr.course?.instructor?.name || '';
    const matchesSearch =
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase());

    const progress = enr.progress_percentage || 0;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && progress >= 100) ||
      (filterStatus === 'in_progress' && progress > 0 && progress < 100) ||
      (filterStatus === 'not_started' && progress === 0);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading your enrolled courses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your progress, resume lectures, and claim completion certificates.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm transition-colors"
        >
          <Compass className="w-4 h-4" /> Explore More Courses
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Courses ({enrollments.length})</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No enrolled courses found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            {searchTerm || filterStatus !== 'all'
              ? 'No courses match your filter criteria.'
              : 'You have not enrolled in any courses yet. Start your journey today!'}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <Compass className="w-4 h-4" /> Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enr) => {
            const c = enr.course;
            if (!c) return null;
            const progress = enr.progress_percentage || 0;
            const isCompleted = progress >= 100;

            return (
              <div
                key={enr.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={
                      c.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {isCompleted ? (
                      <Badge variant="success">Completed</Badge>
                    ) : progress > 0 ? (
                      <Badge variant="info">In Progress</Badge>
                    ) : (
                      <Badge variant="neutral">Not Started</Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-900/80 backdrop-blur-sm text-white">
                      {c.category?.name || 'General'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-navy-900 dark:text-white text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Instructor: <strong className="text-slate-600 dark:text-slate-300">{c.instructor?.name || 'Dr. Temesgen'}</strong>
                    </p>
                  </div>

                  {/* Progress section */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {isCompleted ? 'Course Completed' : 'Progress'}
                        </span>
                        <span className="font-bold text-navy-900 dark:text-white">
                          {progress}%
                        </span>
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

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        to={`/learn/${c.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {progress > 0 ? 'Continue' : 'Start Now'}
                      </Link>

                      {isCompleted && (
                        <Link
                          to="/student/certificates"
                          className="p-2.5 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                          title="View Certificate"
                        >
                          <Award className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
