import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  Eye,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/instructor/courses');
      setCourses(res.data.courses || res.data || []);
    } catch (err) {
      console.error('Error fetching instructor courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && c.is_published) ||
      (statusFilter === 'pending' && !c.is_published && c.approval_status === 'pending') ||
      (statusFilter === 'draft' && !c.is_published && c.approval_status !== 'pending');
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading your courses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your curriculum, track enrollments, and publish new content.
          </p>
        </div>
        <Link
          to="/instructor/create-course"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses ({courses.length})</option>
            <option value="published">Published</option>
            <option value="pending">Pending Approval</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No courses found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : "You haven't created any courses yet. Get started now!"}
          </p>
          <Link
            to="/instructor/create-course"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((c) => {
            const isFree = Number(c.price) === 0;
            const studentsCount = c.enrollments_count || (c.enrollments ? c.enrollments.length : 0);
            const modulesCount = c.modules_count || (c.modules ? c.modules.length : 0);

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={
                      c.thumbnail_url ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {c.is_published ? (
                      <Badge variant="success">Published</Badge>
                    ) : c.approval_status === 'pending' ? (
                      <Badge variant="warning">Under Review</Badge>
                    ) : (
                      <Badge variant="neutral">Draft</Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-navy-900/80 backdrop-blur-sm text-white">
                      {c.category?.name || 'General'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-navy-900 dark:text-white text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4">
                      {c.short_description || c.description}
                    </p>
                  </div>

                  {/* Metadata Stats */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        <strong className="text-navy-900 dark:text-white">{studentsCount}</strong> enrolled
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-accent" />
                        <strong className="text-navy-900 dark:text-white">{modulesCount}</strong> modules
                      </span>
                      <span className="font-bold text-navy-900 dark:text-white">
                        {isFree ? 'Free' : `${Number(c.price).toFixed(2)} ETB`}
                      </span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/instructor/modules?course_id=${c.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-700/70 text-navy-800 dark:text-slate-200 hover:bg-primary hover:text-white transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Curriculum
                      </Link>
                      <Link
                        to={`/courses/${c.id}`}
                        target="_blank"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Preview
                      </Link>
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
