import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import {
  FileText,
  Upload,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
} from 'lucide-react';

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'submitted'
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, subsRes] = await Promise.all([
        api.get('/student/dashboard'),
        api.get('/assignments/my-submissions'),
      ]);

      setPendingAssignments(dashRes.data.upcoming_assignments || []);
      setMySubmissions(subsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (assignment) => {
    setActiveAssignment(assignment);
    setSubmissionText('');
    setErrorMsg('');
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!activeAssignment || !submissionText.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg('');

      await api.post(`/assignments/${activeAssignment.id}/submit`, {
        submission_text: submissionText,
      });

      setSuccessMsg('Your assignment solution has been submitted successfully!');
      setActiveAssignment(null);
      await fetchData();
      setActiveTab('submitted');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assignments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Course Assignments
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Work on hands-on deliverables, upload solutions, and read instructor grading feedback.
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Needs Submission ({pendingAssignments.length})
        </button>

        <button
          onClick={() => setActiveTab('submitted')}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === 'submitted'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Submitted & Graded ({mySubmissions.length})
        </button>
      </div>

      {/* Tab: Pending Assignments */}
      {activeTab === 'pending' && (
        <div>
          {pendingAssignments.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
                You're all caught up!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                There are no pending assignments waiting for your submission.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingAssignments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2 rounded-xl bg-primary/10 text-primary">
                        <FileText className="w-5 h-5" />
                      </span>
                      <Badge variant="primary">{a.max_score} Marks</Badge>
                    </div>

                    <h3 className="font-bold text-navy-900 dark:text-white text-base mb-1">
                      {a.title}
                    </h3>
                    <div className="text-xs text-slate-400 mb-3">
                      Course: {a.course?.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                      {a.description || 'Complete the assignment instructions and submit your work.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline'}
                    </span>

                    <button
                      onClick={() => handleOpenSubmitModal(a)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Submit Solution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Submitted & Graded */}
      {activeTab === 'submitted' && (
        <div>
          {mySubmissions.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
                No submissions yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Submitted assignments will appear here alongside your grades and instructor feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions.map((sub) => {
                const isGraded = sub.status === 'graded';
                const maxScore = sub.assignment?.max_score || 100;
                const feedbacks = sub.feedbacks || [];

                return (
                  <div
                    key={sub.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-navy-900 dark:text-white text-base">
                          {sub.assignment?.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {sub.assignment?.course?.title} • Submitted on{' '}
                          {new Date(sub.submitted_at || sub.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isGraded ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Graded</Badge>
                            <span className="font-bold text-navy-900 dark:text-white text-sm bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                              {sub.grade} / {maxScore} pts
                            </span>
                          </div>
                        ) : (
                          <Badge variant="warning">Under Review</Badge>
                        )}
                      </div>
                    </div>

                    {/* Submission text preview */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Your Submission:
                      </span>
                      {sub.submission_text || 'Submitted file solution.'}
                    </div>

                    {/* Feedback from Instructor if any */}
                    {feedbacks.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary">
                          <MessageSquare className="w-4 h-4" />
                          Instructor Feedback
                        </div>
                        {feedbacks.map((fb) => (
                          <div key={fb.id} className="text-xs text-slate-700 dark:text-slate-300">
                            {fb.feedback_text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {activeAssignment && (
        <Modal
          isOpen={!!activeAssignment}
          onClose={() => setActiveAssignment(null)}
          title={`Submit Assignment: ${activeAssignment.title}`}
        >
          <form onSubmit={handleSubmitSolution} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-navy-900 dark:text-white">
                Course: {activeAssignment.course?.title}
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                {activeAssignment.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Your Answer / Code Solution / Project Link *
              </label>
              <textarea
                rows="7"
                required
                placeholder="Enter your detailed solution, paste your GitHub repository URL, hosted demo URL, or full written response..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60 shadow-sm"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
