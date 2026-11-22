import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  BookOpen,
} from 'lucide-react';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/dashboard');
      setQuizzes(res.data.upcoming_quizzes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading quizzes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Quizzes & Skill Assessments
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete self-graded multiple-choice evaluations to test your mastery.
        </p>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No active quizzes
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Quizzes published by instructors in your enrolled courses will be listed here.
          </p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <BookOpen className="w-4 h-4" /> Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="w-5 h-5" />
                  </span>
                  <Badge variant="primary">{quiz.duration_minutes} Mins</Badge>
                </div>

                <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1 line-clamp-1">
                  {quiz.title}
                </h3>
                <div className="text-xs text-slate-400 mb-3">
                  Course: {quiz.course?.title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {quiz.description || 'Module knowledge verification test.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Pass mark: {quiz.passing_score}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {quiz.max_attempts} attempts
                  </span>
                </div>

                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Start Quiz Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
