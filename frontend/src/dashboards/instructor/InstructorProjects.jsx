import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Rocket,
  Award,
  Github,
  Globe,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  User,
  BookOpen,
} from 'lucide-react';

export default function InstructorProjects() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingSub, setEvaluatingSub] = useState(null);

  // Evaluation Form
  const [score, setScore] = useState(90);
  const [status, setStatus] = useState('graded');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/instructor/project-submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error fetching project submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEvaluation = (sub) => {
    setEvaluatingSub(sub);
    setScore(sub.score || 85);
    setStatus(sub.status === 'graded' ? 'graded' : 'graded');
    setFeedback(sub.evaluation_feedback || '');
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!evaluatingSub || !feedback.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/project-submissions/${evaluatingSub.id}/grade`, {
        score: parseInt(score, 10),
        status,
        evaluation_feedback: feedback.trim(),
      });
      setNotification({
        type: 'success',
        message: 'Project evaluation and skill points awarded successfully!',
      });
      setEvaluatingSub(null);
      fetchSubmissions();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit evaluation.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading capstone project submissions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200/60 dark:border-amber-800/50 mb-2">
          <Rocket className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Principle 3: LEAD Studio</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Real-World Capstone Grading & Mentorship
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Audit student GitHub repositories, test live deployed environments, assign performance scores, and award verified skill points.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-sm font-black">&times;</button>
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Student Project Submissions Queue ({submissions.length})
          </h3>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No capstone submissions in queue at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <img
                      src={sub.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                      alt={sub.user?.name}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {sub.user?.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {sub.user?.email}
                      </span>
                    </div>

                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {sub.project?.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {sub.architecture_notes}
                  </p>

                  {/* Links */}
                  <div className="flex items-center gap-3 text-xs">
                    {sub.github_url && (
                      <a
                        href={sub.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Inspect GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {sub.live_demo_url && (
                      <a
                        href={sub.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    {sub.status === 'graded' ? (
                      <div>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                          Graded: {sub.score}/100
                        </span>
                        <span className="block text-[10px] text-slate-400 font-semibold mt-1">
                          Evaluated by {sub.evaluator?.name || 'Instructor'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                        Needs Evaluation
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openEvaluation(sub)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-600 dark:hover:bg-amber-50 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{sub.status === 'graded' ? 'Update Grade' : 'Evaluate & Grade'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evaluation Grading Modal */}
      {evaluatingSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Evaluate Capstone Project
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Student: <strong className="text-slate-700 dark:text-slate-200">{evaluatingSub.user?.name}</strong> • {evaluatingSub.project?.title}
            </p>

            <form onSubmit={handleSubmitEvaluation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Score (0 - 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-amber-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Evaluation Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="graded">Graded & Passed</option>
                    <option value="revision_requested">Revision Requested</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Constructive Mentoring Feedback *
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide qualitative guidance on code structure, database normalization, testing, and industry best practices..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Save Evaluation & Award Skills'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
