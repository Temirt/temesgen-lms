import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import CourseDiscussions from '../dashboards/student/CourseDiscussions';
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Megaphone,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Rocket,
} from 'lucide-react';

export default function LearnCoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completing, setCompleting] = useState(false);
  const [newCertificate, setNewCertificate] = useState(null);
  const [activeTab, setActiveTab] = useState('learn'); // 'learn', 'link', 'lead', 'announcements'

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await api.get(`/learning/${courseId}`);
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);
        setCompletedLessonIds(res.data.completed_lesson_ids || []);

        const allLessons = [];
        res.data.course?.modules?.forEach((m) => {
          m.lessons?.forEach((l) => allLessons.push(l));
        });

        if (allLessons.length > 0) {
          const firstUncompleted = allLessons.find(
            (l) => !res.data.completed_lesson_ids?.includes(l.id)
          );
          setCurrentLesson(firstUncompleted || allLessons[0]);
        }

        const initialExpanded = {};
        res.data.course?.modules?.forEach((m, idx) => {
          initialExpanded[m.id] = idx === 0;
        });
        setExpandedModules(initialExpanded);
      } catch (err) {
        console.error('Error loading classroom:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [courseId]);

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || completing) return;

    try {
      setCompleting(true);
      const res = await api.post(`/learning/lessons/${currentLesson.id}/complete`);

      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
      }

      if (res.data.enrollment) {
        setEnrollment(res.data.enrollment);
      }

      if (res.data.certificate) {
        setNewCertificate(res.data.certificate);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Launching interactive classroom..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Course Not Found</h2>
        <Link to="/courses" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Browse Courses
        </Link>
      </div>
    );
  }

  const progressPercentage = enrollment?.progress_percentage || 0;
  const isLessonCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-16 bg-[#14213D] text-white px-4 sm:px-6 flex items-center justify-between border-b border-white/10 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            to="/student/courses"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-slate-300 hover:text-white"
            title="Back to My Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="overflow-hidden">
            <h1 className="text-xs sm:text-sm font-extrabold truncate max-w-xs sm:max-w-md lg:max-w-xl text-white">
              {course.title}
            </h1>
            <span className="text-[10px] text-slate-400 block truncate">
              Taught by {course.instructor?.name || 'Instructor'}
            </span>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-300 font-bold">Course Mastery</span>
            <span className="text-xs font-black text-indigo-400">{progressPercentage}% Complete</span>
          </div>
          <div className="w-24 sm:w-32 bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#3B82F6] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Classroom Workspace Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Curriculum Accordion */}
        <aside className="w-full lg:w-80 bg-white dark:bg-slate-850 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curriculum Roadmap
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {completedLessonIds.length} of {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} lessons completed
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {course.modules?.map((mod, modIdx) => {
              const isExpanded = expandedModules[mod.id];
              const modLessons = mod.lessons || [];
              const modCompletedCount = modLessons.filter((l) => completedLessonIds.includes(l.id)).length;

              return (
                <div key={mod.id} className="border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-0.5">
                        Module {modIdx + 1}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {mod.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {modCompletedCount}/{modLessons.length} Completed
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="bg-slate-50/60 dark:bg-slate-900/30 divide-y divide-slate-100 dark:divide-slate-800/60">
                      {modLessons.map((lesson) => {
                        const isCurrent = currentLesson?.id === lesson.id;
                        const isDone = completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setCurrentLesson(lesson);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                              isCurrent
                                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <div className="flex-1 overflow-hidden">
                              <p
                                className={`text-xs truncate ${
                                  isCurrent
                                    ? 'font-bold text-indigo-900 dark:text-indigo-200'
                                    : 'font-medium text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <PlayCircle className="w-3 h-3" />
                                {lesson.duration_minutes} min
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {/* Quizzes in module */}
                      {mod.quizzes?.map((quiz) => (
                        <Link
                          key={quiz.id}
                          to={`/quiz/${quiz.id}`}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-amber-50/60 transition-colors text-amber-900 dark:text-amber-300 border-l-2 border-amber-400"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">Quiz: {quiz.title}</p>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400">
                              {quiz.duration_minutes} mins • Passing: {quiz.passing_score}%
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Lesson Stage */}
        <main className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-64px)]">
          {/* Certificate Celebration Banner if completed */}
          {newCertificate && (
            <div className="m-6 p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-[#6C63FF] to-[#3B82F6] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Course Completed! 🎉</h3>
                  <p className="text-xs text-white/90">
                    Official Certificate <strong>{newCertificate.certificate_number}</strong> has been issued to you!
                  </p>
                </div>
              </div>
              <Link
                to="/student/certificates"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-extrabold hover:bg-slate-100 transition-colors shadow-md shrink-0"
              >
                View Your Certificate
              </Link>
            </div>
          )}

          {/* Lesson Video / Media Player */}
          {currentLesson && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
              {/* Media Player Container */}
              <div className="rounded-3xl overflow-hidden shadow-xl bg-black border border-slate-900 aspect-video relative">
                {currentLesson.content_type === 'video' && currentLesson.video_url ? (
                  <video
                    ref={videoRef}
                    src={currentLesson.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
                    <FileText className="w-16 h-16 text-indigo-400" />
                    <h3 className="text-xl font-bold">{currentLesson.title}</h3>
                    <p className="text-xs text-slate-300 max-w-md">
                      This is a reading module. Please review the comprehensive guide and code examples below.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Bar: Mark Complete */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {currentLesson.title}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {currentLesson.duration_minutes} minutes • Module {currentLesson.module_id}
                  </span>
                </div>

                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isLessonCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isLessonCompleted ? 'Completed (Click to Re-save)' : 'Mark as Completed'}
                  </span>
                </button>
              </div>

              {/* 3 L's Classroom Hub Tabs */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeTab === 'learn'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>1. LEARN (Lesson & Resources)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('link')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeTab === 'link'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>2. LINK (Lesson Q&A Forum)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('lead')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeTab === 'lead'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>3. LEAD (Hands-on Capstone)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeTab === 'announcements'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Announcements ({course.announcements?.length || 0})</span>
                  </button>
                </div>

                {/* TAB 1: LEARN (Lesson Overview, Article & Downloadables) */}
                {activeTab === 'learn' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                        Lesson Overview
                      </h3>
                      {currentLesson.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {currentLesson.description}
                        </p>
                      )}
                      {currentLesson.article_body && (
                        <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                          {currentLesson.article_body}
                        </div>
                      )}
                    </div>

                    {/* Downloadable Materials */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Downloadable Learning Materials ({currentLesson.resources?.length || 0})
                      </h4>
                      {currentLesson.resources && currentLesson.resources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLesson.resources.map((res) => (
                            <div
                              key={res.id}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {res.title}
                                  </h5>
                                  <span className="text-[10px] text-slate-400">
                                    {res.file_type?.toUpperCase()} • {res.file_size || '1.2 MB'}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => alert(`Downloading verified resource: ${res.title}...`)}
                                className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No attachments for this unit.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: LINK (Live Course Q&A Forum) */}
                {activeTab === 'link' && (
                  <div>
                    <CourseDiscussions courseId={course.id} />
                  </div>
                )}

                {/* TAB 3: LEAD (Hands-on Capstones & Practical Evaluations) */}
                {activeTab === 'lead' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          Hands-On Capstone Project for this Course
                        </h3>
                        <p className="text-xs text-slate-500">
                          Demonstrate your engineering competence by engineering a complete application.
                        </p>
                      </div>
                      <Link
                        to="/student/projects"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md"
                      >
                        Open Capstone Studio
                      </Link>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Course Capstone Assignment
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Enterprise E-Commerce & Telebirr/Chapa Ledger Engine
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Build a high-throughput commerce backend with double-entry cryptographic ledger auditing, Sanctum tokens, and reactive checkout flows.
                      </p>
                      <div className="pt-2 flex gap-3">
                        <Link
                          to="/student/projects"
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                        >
                          Submit Project Code
                        </Link>
                        <Link
                          to="/student/skills"
                          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                        >
                          View Skills Matrix
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: Announcements */}
                {activeTab === 'announcements' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Course Announcements
                    </h3>
                    {course.announcements && course.announcements.length > 0 ? (
                      course.announcements.map((ann) => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                          <span className="text-[10px] text-slate-400 block pt-1">
                            Posted {new Date(ann.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No announcements posted for this course yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
