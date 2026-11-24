import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Pin,
  Send,
  PlusCircle,
  HelpCircle,
  Users,
  Award,
} from 'lucide-react';

export default function CourseDiscussions({ courseId = 1 }) {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submittingTopic, setSubmittingTopic] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${courseId}/discussions`);
      setDiscussions(res.data.data || []);
      if (res.data.data?.length > 0 && !selectedDiscussion) {
        fetchDiscussionDetails(res.data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching course discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussionDetails = async (id) => {
    try {
      const res = await api.get(`/discussions/${id}`);
      setSelectedDiscussion(res.data);
    } catch (err) {
      console.error('Error fetching discussion details:', err);
    }
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/discussions/${id}/upvote`);
      setDiscussions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, upvotes: res.data.upvotes } : d))
      );
      if (selectedDiscussion?.id === id) {
        setSelectedDiscussion((prev) => ({ ...prev, upvotes: res.data.upvotes }));
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDiscussion) return;

    try {
      setSubmittingReply(true);
      const res = await api.post(`/discussions/${selectedDiscussion.id}/reply`, {
        content: replyText.trim(),
      });
      setSelectedDiscussion((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), res.data],
      }));
      setReplyText('');
      // update reply count in list
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === selectedDiscussion.id ? { ...d, replies_count: (d.replies_count || 0) + 1 } : d
        )
      );
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setSubmittingTopic(true);
      const res = await api.post(`/courses/${courseId}/discussions`, {
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      setDiscussions((prev) => [res.data, ...prev]);
      setSelectedDiscussion(res.data);
      setShowNewModal(false);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      console.error('Error creating topic:', err);
    } finally {
      setSubmittingTopic(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading discussion forum..." />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/50 mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Principle 2: LINK</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Course Discussions & Q&A
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ask technical questions, share architectural insights, and learn collaboratively with instructors and peers.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Discussion Topic</span>
        </button>
      </div>

      {/* Main Forum Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Topics List */}
        <div className="lg:col-span-5 space-y-2.5">
          {discussions.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No discussions yet. Be the first to start a conversation!
            </div>
          ) : (
            discussions.map((disc) => {
              const isSelected = selectedDiscussion?.id === disc.id;
              return (
                <div
                  key={disc.id}
                  onClick={() => fetchDiscussionDetails(disc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {disc.is_pinned && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                      {disc.is_resolved && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Solved
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleUpvote(disc.id, e)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-600 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{disc.upvotes}</span>
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {disc.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="truncate max-w-[150px]">
                      By {disc.user?.name || 'Student'}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-500 dark:text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{disc.replies_count || 0} replies</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Active Discussion Thread & Replies */}
        <div className="lg:col-span-7">
          {selectedDiscussion ? (
            <div className="bg-white dark:bg-slate-850 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              {/* Main Topic Question */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDiscussion.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                      alt={selectedDiscussion.user?.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {selectedDiscussion.user?.name}
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {selectedDiscussion.user?.role}
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Posted {new Date(selectedDiscussion.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleUpvote(selectedDiscussion.id, e)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{selectedDiscussion.upvotes} Upvotes</span>
                  </button>
                </div>

                <h1 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  {selectedDiscussion.title}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedDiscussion.content}
                </p>
              </div>

              {/* Thread Replies */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Discussion Replies ({selectedDiscussion.replies?.length || 0})
                </h4>

                {selectedDiscussion.replies && selectedDiscussion.replies.length > 0 ? (
                  selectedDiscussion.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                        reply.is_instructor_endorsed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 ring-1 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={reply.user?.name}
                            className="w-7 h-7 rounded-xl object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {reply.user?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-2">
                              {new Date(reply.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {reply.is_instructor_endorsed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                            <Award className="w-3 h-3" /> Endorsed Answer
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No replies yet. Share your answer below!
                  </p>
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handlePostReply} className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <textarea
                  rows={3}
                  placeholder="Write a constructive response or solution..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReply ? 'Posting...' : 'Post Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-850 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
              Select a discussion on the left to read and participate.
            </div>
          )}
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Start a New Discussion Topic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ask a question about assignments, curriculum, or software design.
            </p>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. How to structure repository pattern in Laravel 12?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description & Code Context
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what you are trying to solve or discuss..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTopic}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  {submittingTopic ? 'Publishing...' : 'Publish Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
