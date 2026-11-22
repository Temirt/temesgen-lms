import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import {
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  Award,
  Trash2,
  Eye,
  Star,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetCourse, setRejectTargetCourse] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/courses', {
        params: {
          page,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: search || undefined,
        },
      });
      setCourses(res.data.data || []);
      setPagination({
        currentPage: res.data.current_page || 1,
        lastPage: res.data.last_page || 1,
        total: res.data.total || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
  }, [statusFilter]);

  const handleUpdateStatus = async (courseId, newStatus, reason = null) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, {
        status: newStatus,
        rejection_reason: reason,
      });
      fetchCourses(pagination.currentPage);
    } catch (err) {
      alert('Error updating course status');
    }
  };

  const handleToggleFeature = async (courseId) => {
    try {
      await api.put(`/admin/courses/${courseId}/toggle-feature`);
      fetchCourses(pagination.currentPage);
    } catch (err) {
      alert('Error toggling featured status');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and its curriculum?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      fetchCourses(pagination.currentPage);
    } catch (err) {
      alert('Error deleting course');
    }
  };

  const handleOpenReject = (course) => {
    setRejectTargetCourse(course);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectTargetCourse) return;
    await handleUpdateStatus(rejectTargetCourse.id, 'rejected', rejectReason);
    setRejectModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" size="sm">PUBLISHED</Badge>;
      case 'pending_approval':
        return <Badge variant="warning" size="sm">PENDING APPROVAL</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">REJECTED</Badge>;
      case 'draft':
        return <Badge variant="default" size="sm">DRAFT</Badge>;
      default:
        return <Badge variant="default" size="sm">{status?.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D]">Course Moderation & Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review instructor submissions, approve courses for public release, or archive outdated modules.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCourses(1);
          }}
          className="relative flex-1 w-full"
        >
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#14213D] text-white text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <LoadingSpinner text="Loading courses for moderation..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Instructor</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-12 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-[#14213D] truncate">{c.title}</h4>
                          <span className="text-[10px] text-slate-400">{c.category?.name} • {c.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {c.instructor?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(c.status)}
                      {c.status === 'rejected' && c.rejection_reason && (
                        <p className="text-[10px] text-rose-500 mt-1 max-w-xs truncate">
                          Reason: {c.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-[#14213D]">
                      {c.is_free ? 'Free' : `${Number(c.price).toLocaleString()} ETB`}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleFeature(c.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          c.is_featured
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Toggle Featured"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/courses/${c.slug || c.id}`}
                          target="_blank"
                          title="View Public Page"
                          className="p-1.5 text-slate-400 hover:text-[#6C63FF] hover:bg-slate-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {c.status !== 'published' ? (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'published')}
                            title="Approve & Publish Course"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'draft')}
                            title="Unpublish (Save as Draft)"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-[10px] font-bold"
                          >
                            Unpublish
                          </button>
                        )}

                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => handleOpenReject(c)}
                            title="Reject Course"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          title="Delete Course"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={pagination.currentPage}
              lastPage={pagination.lastPage}
              onPageChange={(p) => fetchCourses(p)}
            />
          </div>
        </div>
      )}

      {/* Reject Course Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Course Submission"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please provide a constructive explanation for rejecting <strong>{rejectTargetCourse?.title}</strong>. The instructor will receive this feedback so they can revise and resubmit.
          </p>

          <textarea
            rows={4}
            required
            placeholder="e.g. Please update audio quality in Module 2 and provide downloadable course slides."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={submitReject}
              className="px-6 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
