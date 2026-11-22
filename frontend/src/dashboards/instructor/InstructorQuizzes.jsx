import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import {
  HelpCircle,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  Trash2,
  BookOpen,
  AlertCircle,
  Eye,
  CheckSquare,
} from 'lucide-react';

export default function InstructorQuizzes() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Modal & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    duration_minutes: 20,
    passing_score: 70,
    max_attempts: 3,
    questions: [
      {
        question_text: '',
        question_type: 'multiple_choice',
        points: 5,
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      },
    ],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchQuizzes(selectedCourseId);
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

  const fetchQuizzes = async (courseId) => {
    try {
      setLoadingQuizzes(true);
      const res = await api.get(`/courses/${courseId}/quizzes`);
      setQuizzes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleAddQuestion = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: '',
          question_type: 'multiple_choice',
          points: 5,
          options: [
            { option_text: '', is_correct: true },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
          ],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (idx) => {
    if (quizForm.questions.length <= 1) return;
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  const handleQuestionTextChange = (idx, text) => {
    setQuizForm((prev) => {
      const q = [...prev.questions];
      q[idx].question_text = text;
      return { ...prev, questions: q };
    });
  };

  const handlePointsChange = (idx, points) => {
    setQuizForm((prev) => {
      const q = [...prev.questions];
      q[idx].points = Number(points);
      return { ...prev, questions: q };
    });
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    setQuizForm((prev) => {
      const q = [...prev.questions];
      q[qIdx].options[optIdx].option_text = text;
      return { ...prev, questions: q };
    });
  };

  const handleSetCorrectOption = (qIdx, optIdx) => {
    setQuizForm((prev) => {
      const q = [...prev.questions];
      q[qIdx].options = q[qIdx].options.map((opt, i) => ({
        ...opt,
        is_correct: i === optIdx,
      }));
      return { ...prev, questions: q };
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg('');

      // Validation
      for (let i = 0; i < quizForm.questions.length; i++) {
        const q = quizForm.questions[i];
        if (!q.question_text.trim()) {
          throw new Error(`Question ${i + 1} text is required`);
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].option_text.trim()) {
            throw new Error(`Question ${i + 1}, Option ${j + 1} text is required`);
          }
        }
      }

      await api.post('/quizzes', {
        course_id: selectedCourseId,
        title: quizForm.title,
        description: quizForm.description,
        duration_minutes: Number(quizForm.duration_minutes),
        passing_score: Number(quizForm.passing_score),
        max_attempts: Number(quizForm.max_attempts),
        questions: quizForm.questions,
      });

      setSuccessMsg('Quiz created successfully!');
      setShowCreateModal(false);
      // Reset
      setQuizForm({
        title: '',
        description: '',
        duration_minutes: 20,
        passing_score: 70,
        max_attempts: 3,
        questions: [
          {
            question_text: '',
            question_type: 'multiple_choice',
            points: 5,
            options: [
              { option_text: '', is_correct: true },
              { option_text: '', is_correct: false },
              { option_text: '', is_correct: false },
              { option_text: '', is_correct: false },
            ],
          },
        ],
      });
      await fetchQuizzes(selectedCourseId);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading quizzes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Course Quizzes & Assessments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create automated multiple choice tests to evaluate student comprehension.
          </p>
        </div>

        {courses.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Create New Quiz
          </button>
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
          Total Quizzes: <strong className="text-navy-900 dark:text-white">{quizzes.length}</strong>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Quizzes Grid */}
      {loadingQuizzes ? (
        <LoadingSpinner text="Refreshing quizzes..." />
      ) : quizzes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No quizzes for this course
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Add knowledge checks, chapter quizzes, or a final exam.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Create First Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const qCount = quiz.questions_count ?? (quiz.questions ? quiz.questions.length : 0);
            return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1.5 line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {quiz.description || 'Comprehensive module evaluation quiz.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{quiz.duration_minutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pass: {quiz.passing_score}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{qCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">{quiz.max_attempts}</span>
                      <span>Attempts Max</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-navy-800 dark:text-slate-200 hover:bg-primary hover:text-white transition-colors"
                    >
                      Preview Quiz
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Quiz Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Course Quiz"
      >
        <form onSubmit={handleCreateQuiz} className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Midterm Assessment: Core Algorithms"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Instructions / Description
              </label>
              <textarea
                rows="2"
                placeholder="Provide instructions for students before they begin..."
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Time (Mins)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quizForm.duration_minutes}
                  onChange={(e) => setQuizForm({ ...quizForm, duration_minutes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Pass Mark %
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={quizForm.passing_score}
                  onChange={(e) => setQuizForm({ ...quizForm, passing_score: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quizForm.max_attempts}
                  onChange={(e) => setQuizForm({ ...quizForm, max_attempts: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                Questions ({quizForm.questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {quizForm.questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase">
                    Question #{qIdx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Pts:</span>
                      <input
                        type="number"
                        min="1"
                        value={q.points}
                        onChange={(e) => handlePointsChange(qIdx, e.target.value)}
                        className="w-14 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs text-navy-900 dark:text-white bg-white dark:bg-slate-800"
                      />
                    </div>
                    {quizForm.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Enter the question here..."
                  value={q.question_text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-navy-900 dark:text-white"
                />

                {/* Options */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-400 font-medium">
                    Answer options (select the radio button next to the correct answer):
                  </p>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_opt_${qIdx}`}
                        checked={opt.is_correct}
                        onChange={() => handleSetCorrectOption(qIdx, optIdx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt.option_text}
                        onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                        className={`flex-1 px-3 py-1.5 rounded-lg border text-xs text-navy-900 dark:text-white bg-white dark:bg-slate-800 ${
                          opt.is_correct
                            ? 'border-emerald-500 bg-emerald-50/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? 'Creating Quiz...' : 'Publish Quiz'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
