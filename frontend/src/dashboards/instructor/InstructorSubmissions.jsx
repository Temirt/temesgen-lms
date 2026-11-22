import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Pagination from '../../components/Pagination';
import {
  CheckSquare,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function InstructorSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Grading Modal
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/instructor/submissions?page=${page}`);
      const data = res.data;
      setSubmissions(data.data || data || []);
      setTotalPages(data.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeModal = (sub) => {
    setActiveSubmission(sub);
    setGradeInput(sub.grade !== null && sub.grade !== undefined ? sub.grade : '');
    const latestFeedback = sub.feedbacks && sub.feedbacks.length > 0 ? sub.feedbacks[0].feedback_text : '';
    setFeedbackInput(latestFeedback || '');
    setErrorMsg('');
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!activeSubmission) return;

    try {
      setSavingGrade(true);
      setErrorMsg('');

      const res = await api.post(`/submissions/${activeSubmission.id}/grade`, {
        grade: Number(gradeInput),
        feedback: feedbackInput,
      });

      setSuccessMsg('Grade and feedback submitted successfully!');
      setActiveSubmission(null);
      await fetchSubmissions(currentPage);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit grade');
    } finally {
      setSavingGrade(false);
    }
  };

  const filtered = submissions.filter((s) => {
    const studentName = s.user?.name || '';
    const assignmentTitle = s.assignment?.title || '';
    const courseTitle = s.assignment?.course?.title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'graded' && s.status === 'graded') ||
      (statusFilter === 'pending' && s.status !== 'graded');

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading student submissions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Student Submissions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review student answers, assign marks, and provide constructive mentoring feedback.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, assignment, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            <option value="all">All Submissions</option>
            <option value="pending">Needs Grading</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {/* Submissions Table / List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No submissions found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchTerm || statusFilter !== 'all'
              ? 'No submissions match your search filter.'
              : 'Students have not submitted any assignments yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Assignment & Course</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status & Score</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {filtered.map((sub) => {
                  const isGraded = sub.status === 'graded';
                  const maxScore = sub.assignment?.max_score || 100;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors"
                    >
                      {/* Student info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              sub.user?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                sub.user?.name || 'Student'
                              )}&background=14213d&color=fff`
                            }
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-navy-900 dark:text-white">
                              {sub.user?.name}
                            </div>
                            <div className="text-xs text-slate-400">{sub.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Assignment & Course */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-navy-900 dark:text-white line-clamp-1">
                          {sub.assignment?.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {sub.assignment?.course?.title}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {sub.submitted_at
                          ? new Date(sub.submitted_at).toLocaleString()
                          : new Date(sub.created_at).toLocaleString()}
                      </td>

                      {/* Status & Score */}
                      <td className="py-4 px-4">
                        {isGraded ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Graded</Badge>
                            <span className="font-bold text-navy-900 dark:text-white text-xs">
                              {sub.grade} / {maxScore}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="warning">Needs Grading</Badge>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          {isGraded ? 'Review / Edit Grade' : 'Grade Submission'}
                        </button>
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

      {/* Grade Modal */}
      {activeSubmission && (
        <Modal
          isOpen={!!activeSubmission}
          onClose={() => setActiveSubmission(null)}
          title={`Grade Submission: ${activeSubmission.user?.name}`}
        >
          <form onSubmit={handleSubmitGrade} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-navy-900 dark:text-white">
                {activeSubmission.assignment?.title}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Course: {activeSubmission.assignment?.course?.title}
              </div>
            </div>

            {/* Student's answer */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Student's Submitted Solution / Text:
              </label>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-navy-900 dark:text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {activeSubmission.content || activeSubmission.submission_text || 'No text submitted.'}
              </div>
            </div>

            {/* File attachment if any */}
            {activeSubmission.file_path && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-primary" />
                  Attachment Uploaded
                </span>
                <a
                  href={`http://127.0.0.1:8000/storage/${activeSubmission.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Download / View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Grade Input */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Score (out of {activeSubmission.assignment?.max_score || 100}) *
              </label>
              <input
                type="number"
                min="0"
                max={activeSubmission.assignment?.max_score || 100}
                step="0.5"
                required
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                placeholder="e.g. 95"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white font-bold"
              />
            </div>

            {/* Feedback Input */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Instructor Feedback & Comments
              </label>
              <textarea
                rows="4"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Give constructive feedback on what the student did well and what could be improved..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveSubmission(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingGrade}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {savingGrade ? 'Saving Grade...' : 'Submit Grade & Feedback'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
