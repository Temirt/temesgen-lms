import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
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
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson', 'announcements', 'resources'

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await api.get(`/learning/${courseId}`);
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);
        setCompletedLessonIds(res.data.completed_lesson_ids || []);

        // Pick initial active lesson
        const allLessons = [];
        res.data.course?.modules?.forEach((m) => {
          m.lessons?.forEach((l) => allLessons.push(l));
        });

        if (allLessons.length > 0) {
          // If there's a last accessed or uncompleted lesson, pick it, else pick first
          const firstUncompleted = allLessons.find(
            (l) => !res.data.completed_lesson_ids?.includes(l.id)
          );
          const initial = firstUncompleted || allLessons[0];
          setCurrentLesson(initial);

          // Expand initial module
          if (initial.module_id) {
            setExpandedModules({ [initial.module_id]: true });
          }
        }
      } catch (err) {
        console.error('Error loading classroom:', err);
        alert(err.response?.data?.message || 'Access restricted to enrolled students');
        navigate(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [courseId, navigate]);

  // Handle Mark Completed
  const handleMarkCompleted = async () => {
    if (!currentLesson || completing) return;
    setCompleting(true);

    try {
      const res = await api.post(`/learning/lessons/${currentLesson.id}/complete`);
      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
      }

      if (enrollment) {
        setEnrollment((prev) => ({
          ...prev,
          progress_percentage: res.data.progress_percentage,
          status: res.data.progress_percentage >= 100 ? 'completed' : prev.status,
        }));
      }

      if (res.data.certificate_issued && res.data.certificate) {
        setNewCertificate(res.data.certificate);
      }

      // Automatically advance to next lesson if available
      goToNextLesson();
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  // Flattened list of all lessons in course for Prev/Next navigation
  const allLessons = course?.modules?.flatMap((m) => m.lessons || []) || [];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const goToNextLesson = () => {
    if (nextLesson) {
      setCurrentLesson(nextLesson);
      if (nextLesson.module_id) {
        setExpandedModules((prev) => ({ ...prev, [nextLesson.module_id]: true }));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevLesson = () => {
    if (prevLesson) {
      setCurrentLesson(prevLesson);
      if (prevLesson.module_id) {
        setExpandedModules((prev) => ({ ...prev, [prevLesson.module_id]: true }));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  if (loading) {
    return <LoadingSpinner text="Launching interactive classroom..." />;
  }

  if (!course) return null;

  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isLessonCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-16 bg-[#14213D] text-white px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to={`/courses/${course.id}`}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="max-w-md truncate">
            <span className="text-[10px] text-[#6C63FF] font-bold uppercase tracking-wider block">
              Classroom
            </span>
            <h1 className="text-sm font-bold text-white truncate">{course.title}</h1>
          </div>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#6C63FF] to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">{progressPercent}% Completed</span>
          </div>

          {progressPercent >= 100 && (
            <Link
              to="/student/certificates"
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold flex items-center gap-1 shadow-md hover:brightness-105"
            >
              <Award className="w-3.5 h-3.5" /> View Certificate
            </Link>
          )}
        </div>
      </header>

      {/* Main Learning Classroom Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Curriculum & Lessons */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200/80 flex flex-col shrink-0 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-64px)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-extrabold text-[#14213D] uppercase tracking-wider">
              Course Content
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {completedCount} of {totalLessons} lessons finished
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {course.modules?.map((mod, modIdx) => {
              const isExpanded = !!expandedModules[mod.id];
              return (
                <div key={mod.id}>
                  {/* Module header toggle */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50/80 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Module {modIdx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-[#14213D] line-clamp-1">{mod.title}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Lessons list */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-50">
                      {mod.lessons?.map((lesson) => {
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
                                ? 'bg-indigo-50/80 border-l-4 border-[#6C63FF]'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <div className="flex-1 overflow-hidden">
                              <p
                                className={`text-xs truncate ${
                                  isCurrent ? 'font-bold text-[#14213D]' : 'font-medium text-slate-700'
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
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-amber-50/60 transition-colors text-amber-900 border-l-2 border-amber-400"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">Quiz: {quiz.title}</p>
                            <span className="text-[10px] text-amber-700">
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
            <div className="m-6 p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-[#6C63FF] to-[#3B82F6] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
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
                    key={currentLesson.id}
                    src={currentLesson.video_url}
                    controls
                    className="w-full h-full object-contain"
                    poster={course.thumbnail}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-900">
                    <BookOpen className="w-12 h-12 text-[#6C63FF] mb-3" />
                    <h3 className="text-base font-bold text-white">{currentLesson.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      This lesson is an interactive reading and practice guide. Review the materials below.
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Controls: Prev, Next, Mark Complete */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={goToPrevLesson}
                    disabled={!prevLesson}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={goToNextLesson}
                    disabled={!nextLesson}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mark as Completed Button */}
                <button
                  onClick={handleMarkCompleted}
                  disabled={completing}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                    isLessonCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#14213D] text-white hover:bg-[#6C63FF]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isLessonCompleted ? 'Completed (Click to Re-complete)' : 'Mark as Completed'}
                </button>
              </div>

              {/* Lesson Tabs: Notes, Downloadable Resources, Announcements */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-3 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className={`pb-3 -mb-3 transition-colors ${
                      activeTab === 'lesson'
                        ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lesson Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-3 -mb-3 transition-colors flex items-center gap-1 ${
                      activeTab === 'resources'
                        ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Resources ({currentLesson.resources?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`pb-3 -mb-3 transition-colors flex items-center gap-1 ${
                      activeTab === 'announcements'
                        ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Announcements ({course.announcements?.length || 0})
                  </button>
                </div>

                {/* Tab 1: Lesson Overview */}
                {activeTab === 'lesson' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-[#14213D]">{currentLesson.title}</h2>
                    {currentLesson.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {currentLesson.description}
                      </p>
                    )}
                    {currentLesson.article_body && (
                      <div className="prose prose-sm max-w-none text-xs text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed font-mono">
                        {currentLesson.article_body}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Downloadable Resources */}
                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#14213D]">Downloadable Materials</h3>
                    {currentLesson.resources && currentLesson.resources.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentLesson.resources.map((res) => (
                          <div
                            key={res.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-[#6C63FF]" />
                              <div>
                                <h4 className="text-xs font-bold text-[#14213D]">{res.title}</h4>
                                <span className="text-[10px] text-slate-400">
                                  {res.file_type?.toUpperCase()} • {res.file_size || '1.5 MB'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Downloading ${res.title}...`)}
                              className="p-2 rounded-xl text-slate-600 hover:text-[#6C63FF] hover:bg-white transition-colors"
                              title="Download Resource"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No downloadable files attached to this lesson.</p>
                    )}
                  </div>
                )}

                {/* Tab 3: Announcements */}
                {activeTab === 'announcements' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#14213D]">Course Announcements</h3>
                    {course.announcements && course.announcements.length > 0 ? (
                      course.announcements.map((ann) => (
                        <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-[#6C63FF]" />
                            <h4 className="text-xs font-bold text-[#14213D]">{ann.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
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
