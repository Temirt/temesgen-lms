import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  UserCheck,
  Search,
  Filter,
  BookOpen,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // Fetch from admin dashboard or instructor students
      const res = await api.get('/admin/dashboard');
      setEnrollments(res.data.recent_enrollments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((e) => {
    const student = e.user?.name || '';
    const course = e.course?.title || '';
    return (
      student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner text="Loading system enrollments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          System Enrollments
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track student enrollments, completion records, and academic progress across all courses.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <UserCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No enrollments found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Student enrollments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {filtered.map((enr) => {
                  const progress = enr.progress_percentage || 0;
                  const isCompleted = progress >= 100;

                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750">
                      <td className="py-4 px-4 font-semibold text-navy-900 dark:text-white">
                        {enr.user?.name || 'Student'}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {enr.course?.title || 'Course'}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(enr.enrollment_date || enr.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-navy-900 dark:text-white">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isCompleted ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <Badge variant="info">Active</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
