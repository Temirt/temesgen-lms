import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function InstructorAnnouncements() {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, annRes] = await Promise.all([
        api.get('/instructor/courses'),
        api.get('/announcements'),
      ]);

      const cList = coursesRes.data.courses || coursesRes.data || [];
      setCourses(cList);
      if (cList.length > 0) {
        setForm((prev) => ({ ...prev, course_id: cList[0].id.toString() }));
      }
      setAnnouncements(annRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    try {
      setSaving(true);
      setErrorMsg('');

      await api.post('/announcements', {
        course_id: form.course_id || null,
        title: form.title,
        message: form.message,
      });

      setSuccessMsg('Announcement published successfully to enrolled students!');
      setShowModal(false);
      setForm((prev) => ({
        ...prev,
        title: '',
        message: '',
      }));
      await fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading announcements..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Course Announcements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send real-time updates, schedule notices, and webinar links to your enrolled students.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Post New Announcement
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No announcements published yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Keep your students informed about live sessions, homework due dates, or course updates.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Post Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Megaphone className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-navy-900 dark:text-white text-base">
                    {ann.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {ann.course ? (
                    <Badge variant="primary">{ann.course.title}</Badge>
                  ) : (
                    <Badge variant="info">Global Broadcast</Badge>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-10">
                {ann.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Post New Announcement"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Select Target Course
            </label>
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All My Courses / Global</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Live Q&A Office Hours this Friday at 6:00 PM"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Message Content *
            </label>
            <textarea
              rows="5"
              required
              placeholder="Write the message that will be delivered to enrolled students..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              {saving ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
