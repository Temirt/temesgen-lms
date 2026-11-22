import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import {
  FileText,
  Plus,
  Calendar,
  Award,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Clock,
} from 'lucide-react';

export default function InstructorAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    max_score: 100,
    due_date: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchAssignments(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/instructor/courses');
      const list = res.data.courses || res.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      setLoadingAssignments(true);
      const res = await api.get(`/courses/${courseId}/assignments`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg('');

      await api.post('/assignments', {
        course_id: selectedCourseId,
        title: form.title,
        description: form.description,
        max_score: Number(form.max_score),
        due_date: form.due_date || null,
      });

      setSuccessMsg('Assignment published successfully!');
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        max_score: 100,
        due_date: '',
      });
      await fetchAssignments(selectedCourseId);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assignments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Course Assignments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create practical project challenges, track due dates, and review student work.
          </p>
        </div>

        {courses.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              to="/instructor/submissions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-colors"
            >
              <Users className="w-4 h-4" /> View Submissions
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
        )}
      </div>

      {/* Course Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <span className="text-sm font-semibold text-navy-900 dark:text-white shrink-0">
            Select Course:
          </span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full md:w-80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Total Assignments: <strong className="text-navy-900 dark:text-white">{assignments.length}</strong>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Assignments List */}
      {loadingAssignments ? (
        <LoadingSpinner text="Refreshing assignments..." />
      ) : assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No assignments for this course
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Give your students real-world hands-on exercises and coding tasks.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Create First Assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <FileText className="w-5 h-5" />
                  </span>
                  <Badge variant="primary">{assignment.max_score} Points</Badge>
                </div>

                <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2 line-clamp-1">
                  {assignment.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                  {assignment.description || 'Hands-on project assignment for course mastery.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No deadline'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Published
                  </span>
                </div>

                <Link
                  to={`/instructor/submissions`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-navy-800 dark:text-slate-200 hover:bg-primary hover:text-white transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  Grade Submissions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create Assignment */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Capstone Project: Build a Full-Stack REST API"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Max Score (Marks) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.max_score}
                onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Instructions & Acceptance Criteria
            </label>
            <textarea
              rows="5"
              placeholder="Detail the problem statement, deliverables required, formatting, and grading rubric..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? 'Publishing...' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
