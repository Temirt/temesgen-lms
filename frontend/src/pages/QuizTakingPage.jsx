import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertTriangle,
} from 'lucide-react';

export default function QuizTakingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        alert(err.response?.data?.message || 'Error loading quiz');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        selected_option_id: optionId,
      },
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        text_answer: text,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = quiz.questions?.length || 0;

    if (answeredCount < totalQuestions) {
      if (!window.confirm(`You answered ${answeredCount} of ${totalQuestions} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        answers: Object.values(answers),
      };

      const res = await api.post(`/quizzes/${id}/attempt`, payload);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading examination questions..." />;
  }

  if (!quiz) return null;

  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-wider">
                {quiz.course?.title}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#14213D] mt-1">{quiz.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {questions.length} questions • Passing score: {quiz.passing_score}%
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <Clock className="w-4 h-4 text-[#6C63FF]" />
            <span>{quiz.duration_minutes} Mins</span>
          </div>
        </div>

        {/* RESULTS SCREEN */}
        {result ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-8 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${
                result.is_passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {result.is_passed ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>

            <div>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  result.is_passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {result.is_passed ? 'ASSESSMENT PASSED' : 'NEEDS IMPROVEMENT'}
              </span>
              <h2 className="text-3xl font-extrabold text-[#14213D] mt-3">
                Your Score: {result.percentage}%
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                You earned {result.score} out of {result.total_points} total points.
              </p>
            </div>

            {/* Answer breakdown */}
            <div className="text-left space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#14213D]">Question Review</h3>
              {result.attempt?.answers?.map((ans, idx) => (
                <div
                  key={ans.id}
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    ans.is_correct ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Question {idx + 1}</span>
                    <span
                      className={`font-extrabold ${
                        ans.is_correct ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {ans.is_correct ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{ans.question?.question_text}</p>
                  {ans.question?.explanation && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      Explanation: {ans.question.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to={`/learn/${quiz.course_id}`}
                className="px-6 py-3 rounded-2xl bg-[#14213D] text-white text-xs font-extrabold hover:bg-[#6C63FF] transition-colors shadow-md"
              >
                Return to Course Classroom
              </Link>
            </div>
          </div>
        ) : (
          /* QUESTION CARD */
          currentQ && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
              {/* Question Navigation Bubbles */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#14213D] text-white ring-2 ring-[#6C63FF]'
                          : isAnswered
                          ? 'bg-[#6C63FF] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {questions.length} • {currentQ.points} Points
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#14213D] leading-snug">
                  {currentQ.question_text}
                </h3>
              </div>

              {/* Multiple Choice / True-False Options */}
              {currentQ.question_type !== 'short_answer' ? (
                <div className="space-y-3">
                  {currentQ.options?.map((opt) => {
                    const isSelected = answers[currentQ.id]?.selected_option_id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(currentQ.id, opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-[#6C63FF] bg-[#6C63FF]/5 text-[#14213D] shadow-sm ring-1 ring-[#6C63FF]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#6C63FF] bg-[#6C63FF] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span>{opt.option_text}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Short answer text area */
                <div>
                  <textarea
                    rows={3}
                    placeholder="Type your answer here..."
                    value={answers[currentQ.id]?.text_answer || ''}
                    onChange={(e) => handleTextAnswerChange(currentQ.id, e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF] focus:bg-white transition-colors"
                  />
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                    className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-lg hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Grading Answers...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
