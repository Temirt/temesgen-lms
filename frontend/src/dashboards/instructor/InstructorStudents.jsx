import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Pagination from '../../components/Pagination';
import {
  GraduationCap,
  Search,
  Filter,
  Mail,
  Calendar,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

export default function InstructorStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/instructor/students?page=${page}`);
      const data = res.data;
      setEnrollments(data.data || data || []);
      setTotalPages(data.last_page || 1);
      setTotalStudents(data.total || (data.data ? data.data.length : 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((e) => {
    const name = e.user?.name || '';
    const email = e.user?.email || '';
    const course = e.course?.title || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && e.progress_percentage >= 100) ||
      (statusFilter === 'in_progress' && e.progress_percentage > 0 && e.progress_percentage < 100) ||
      (statusFilter === 'not_started' && e.progress_percentage === 0);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading enrolled students..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Enrolled Students
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor student roster, learning progress, and course completion rates.
          </p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          Total Enrollments: <strong className="text-navy-900 dark:text-white">{totalStudents}</strong>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Progress:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Students</option>
            <option value="completed">Completed (100%)</option>
            <option value="in_progress">In Progress</option>
            <option value="not_started">Not Started (0%)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No enrolled students found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchTerm || statusFilter !== 'all'
              ? 'No students matched the filter criteria.'
              : 'As students enroll in your courses, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Enrolled Course</th>
                  <th className="py-3.5 px-4">Enrolled Date</th>
                  <th className="py-3.5 px-4 w-48">Progress</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {filtered.map((enr) => {
                  const progress = enr.progress_percentage || 0;
                  const isCompleted = progress >= 100;

                  return (
                    <tr
                      key={enr.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors"
                    >
                      {/* Student info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              enr.user?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                enr.user?.name || 'Student'
                              )}&background=14213d&color=fff`
                            }
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-navy-900 dark:text-white">
                              {enr.user?.name}
                            </div>
                            <div className="text-xs text-slate-400">{enr.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-navy-900 dark:text-white line-clamp-1">
                          {enr.course?.title}
                        </div>
                      </td>

                      {/* Enrolled Date */}
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {enr.enrollment_date
                          ? new Date(enr.enrollment_date).toLocaleDateString()
                          : new Date(enr.created_at).toLocaleDateString()}
                      </td>

                      {/* Progress bar */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-navy-900 dark:text-white">{progress}%</span>
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
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-right">
                        {isCompleted ? (
                          <Badge variant="success">Completed</Badge>
                        ) : progress > 0 ? (
                          <Badge variant="info">In Progress</Badge>
                        ) : (
                          <Badge variant="neutral">Not Started</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
