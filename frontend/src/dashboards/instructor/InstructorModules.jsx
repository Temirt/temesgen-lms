import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import {
  Layers,
  Plus,
  PlayCircle,
  FileText,
  FileCode,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

export default function InstructorModules() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseId = searchParams.get('course_id') || '';

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Expanded modules state (module ID -> boolean)
  const [expandedModules, setExpandedModules] = useState({});

  // Modals state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    sort_order: 1,
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content_type: 'video',
    video_url: '',
    article_body: '',
    duration_minutes: 15,
    is_preview: false,
    sort_order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseDetails(selectedCourseId);
      setSearchParams({ course_id: selectedCourseId });
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/instructor/courses');
      const list = res.data.courses || res.data || [];
      setCourses(list);
      if (!selectedCourseId && list.length > 0) {
        setSelectedCourseId(list[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load instructor courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const res = await api.get(`/courses/${id}`);
      const course = res.data.course || res.data;
      setCourseDetails(course);

      // Expand all modules by default
      if (course?.modules) {
        const initialExp = {};
        course.modules.forEach((m) => {
          initialExp[m.id] = true;
        });
        setExpandedModules(initialExp);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg('');
      await api.post('/instructor/modules', {
        course_id: selectedCourseId,
        title: moduleForm.title,
        description: moduleForm.description,
        sort_order: Number(moduleForm.sort_order),
      });

      setSuccessMsg('Module created successfully!');
      setShowModuleModal(false);
      setModuleForm({ title: '', description: '', sort_order: 1 });
      await fetchCourseDetails(selectedCourseId);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create module');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddLesson = (moduleId) => {
    setTargetModuleId(moduleId);
    setLessonForm({
      title: '',
      description: '',
      content_type: 'video',
      video_url: '',
      article_body: '',
      duration_minutes: 15,
      is_preview: false,
      sort_order: 1,
    });
    setShowLessonModal(true);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg('');
      await api.post('/instructor/lessons', {
        course_id: selectedCourseId,
        module_id: targetModuleId,
        title: lessonForm.title,
        description: lessonForm.description,
        content_type: lessonForm.content_type,
        video_url: lessonForm.content_type === 'video' ? lessonForm.video_url : null,
        article_body: lessonForm.content_type === 'article' ? lessonForm.article_body : null,
        duration_minutes: Number(lessonForm.duration_minutes),
        is_preview: lessonForm.is_preview,
        sort_order: Number(lessonForm.sort_order),
      });

      setSuccessMsg('Lesson added successfully!');
      setShowLessonModal(false);
      await fetchCourseDetails(selectedCourseId);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading curriculum..." />;
  }

  const modules = courseDetails?.modules || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Curriculum Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Structure your course sections, video lectures, and reading materials.
          </p>
        </div>

        {courses.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModuleForm({
                  title: '',
                  description: '',
                  sort_order: (modules.length || 0) + 1,
                });
                setShowModuleModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>
        )}
      </div>

      {/* Course Selector Card */}
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

        {courseDetails && (
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-navy-900 dark:text-white">{modules.length}</strong> modules
            </span>
            <span>•</span>
            <span>
              <strong className="text-navy-900 dark:text-white">
                {modules.reduce((sum, m) => sum + (m.lessons ? m.lessons.length : 0), 0)}
              </strong>{' '}
              total lessons
            </span>
            <span>•</span>
            <Link
              to={`/courses/${selectedCourseId}`}
              target="_blank"
              className="text-primary hover:underline font-medium"
            >
              View Public Page
            </Link>
          </div>
        )}
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Modules List Accordion */}
      {loadingDetails ? (
        <LoadingSpinner text="Refreshing modules..." />
      ) : modules.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No modules created yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Break your course down into structured learning modules and add lessons.
          </p>
          <button
            onClick={() => {
              setModuleForm({ title: '', description: '', sort_order: 1 });
              setShowModuleModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add First Module
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules[mod.id] ?? true;
            const lessons = mod.lessons || [];

            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm"
              >
                {/* Module Header Bar */}
                <div
                  className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white text-base">
                        {mod.title}
                      </h3>
                      {mod.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                      {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => handleOpenAddLesson(mod.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Lesson
                    </button>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lessons in this Module */}
                {isExpanded && (
                  <div className="p-4 divide-y divide-slate-100 dark:divide-slate-700/40">
                    {lessons.length === 0 ? (
                      <p className="text-center py-6 text-sm text-slate-400">
                        No lessons in this module yet. Click "+ Add Lesson" to create one.
                      </p>
                    ) : (
                      lessons.map((les, lesIdx) => (
                        <div
                          key={les.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-xs font-mono w-5">
                              {modIdx + 1}.{lesIdx + 1}
                            </span>
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {les.content_type === 'video' ? (
                                <PlayCircle className="w-4 h-4 text-primary" />
                              ) : (
                                <FileText className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-navy-900 dark:text-white">
                                  {les.title}
                                </span>
                                {les.is_preview && (
                                  <Badge variant="info">Free Preview</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                <span className="capitalize">{les.content_type}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {les.duration_minutes || 10} min
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Module Modal */}
      <Modal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title="Add New Course Module"
      >
        <form onSubmit={handleCreateModule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Module Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Section 1: Introduction to React & State Management"
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Overview / Objective (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Brief summary of what will be learned in this module..."
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              min="1"
              value={moduleForm.sort_order}
              onChange={(e) => setModuleForm({ ...moduleForm, sort_order: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowModuleModal(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title="Add Lesson to Module"
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Understanding Props and Immutability"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Content Type
              </label>
              <select
                value={lessonForm.content_type}
                onChange={(e) => setLessonForm({ ...lessonForm, content_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="video">Video Lecture</option>
                <option value="article">Article / Reading</option>
                <option value="document">Document / PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Est. Duration (Minutes) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={lessonForm.duration_minutes}
                onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {lessonForm.content_type === 'video' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Video Stream URL (YouTube, Vimeo, or Direct MP4) *
              </label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=... or https://commondatastorage.googleapis.com/..."
                value={lessonForm.video_url}
                onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {lessonForm.content_type === 'article' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Article Body / Notes (Markdown or Text)
              </label>
              <textarea
                rows="6"
                placeholder="Write lesson notes, code snippets, key takeaways..."
                value={lessonForm.article_body}
                onChange={(e) => setLessonForm({ ...lessonForm, article_body: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_preview"
              checked={lessonForm.is_preview}
              onChange={(e) => setLessonForm({ ...lessonForm, is_preview: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="is_preview" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Allow Free Preview (Students can view without enrolling)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowLessonModal(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
