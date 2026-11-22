import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Megaphone, Plus, Pin, Calendar } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', is_pinned: false });
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/announcements', formData);
      setModalOpen(false);
      setFormData({ title: '', content: '', is_pinned: false });
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting announcement');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D]">Platform Announcements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast platform updates, scheduled maintenance notices, and academic releases.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Broadcast Announcement
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading announcements..." />
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-3xl border bg-white shadow-sm space-y-3 transition-all ${
                ann.is_pinned ? 'border-[#6C63FF] ring-1 ring-[#6C63FF]/30' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#6C63FF]" />
                  <h3 className="text-sm font-bold text-[#14213D]">{ann.title}</h3>
                  {ann.is_pinned && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C63FF] border border-indigo-100 flex items-center gap-1">
                      <Pin className="w-3 h-3" /> Pinned Notice
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{ann.content}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Posted by {ann.instructor?.name || 'Administrator'} {ann.course ? `for ${ann.course.title}` : '(Platform-Wide)'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Announcement"
        size="md"
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notice Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Scheduled System Maintenance this Sunday"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Body</label>
            <textarea
              rows={4}
              required
              placeholder="Write the full message details..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin_notice"
              checked={formData.is_pinned}
              onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
            />
            <label htmlFor="pin_notice" className="text-xs font-bold text-slate-700">
              Pin to top of student notifications
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={posting}
              className="px-6 py-2 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] disabled:opacity-50"
            >
              {posting ? 'Broadcasting...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
