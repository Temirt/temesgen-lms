import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Image,
  DollarSign,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function CourseCreateWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Course Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    subtitle: '',
    description: '',
    category_id: '',
    level: 'all_levels',
    language: 'English',

    // Step 2: Course Details
    objectives: ['Master the core concepts', 'Build hands-on production systems'],
    requirements: ['Basic understanding of programming', 'Computer with internet connection'],
    target_audience: 'Aspiring and professional engineers looking to advance their technical career.',
    duration_hours: 12.0,

    // Step 3: Media
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    promo_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',

    // Step 4: Pricing
    is_free: false,
    price: 1500,

    // Step 5 & 6: Content & Status
    status: 'published',
  });

  useEffect(() => {
    api.get('/courses/categories')
      .then((res) => {
        setCategories(res.data || []);
        if (res.data?.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && (!formData.title || !formData.description || !formData.category_id)) {
      alert('Please fill in the title, category, and description before proceeding.');
      return;
    }
    setCurrentStep((s) => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add / remove dynamic list items
  const addObjective = () => {
    setFormData((prev) => ({ ...prev, objectives: [...prev.objectives, ''] }));
  };

  const updateObjective = (index, value) => {
    const list = [...formData.objectives];
    list[index] = value;
    setFormData((prev) => ({ ...prev, objectives: list }));
  };

  const removeObjective = (index) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({ ...prev, requirements: [...prev.requirements, ''] }));
  };

  const updateRequirement = (index, value) => {
    const list = [...formData.requirements];
    list[index] = value;
    setFormData((prev) => ({ ...prev, requirements: list }));
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleFinalSubmit = async (publishStatus = 'published') => {
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status: publishStatus,
        price: formData.is_free ? 0 : Number(formData.price),
      };

      const res = await api.post('/instructor/courses', payload);
      navigate(`/instructor/courses`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error creating course');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Details' },
    { num: 3, title: 'Media' },
    { num: 4, title: 'Pricing' },
    { num: 5, title: 'Modules' },
    { num: 6, title: 'Publish' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#14213D]">Multi-Step Course Creation</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step-by-step authoring wizard for new courses, curriculum, and pricing models.
        </p>
      </div>

      {/* Progress Wizard Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
          {steps.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-[#14213D] text-white ring-4 ring-[#6C63FF]/20'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1.5 hidden sm:inline ${
                    isCurrent ? 'text-[#14213D]' : 'text-slate-400'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          {errorMsg}
        </div>
      )}

      {/* Step Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#14213D]">Step 1: Course Basic Information</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Course Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Master React & Tailwind CSS Architecture"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subtitle / Short Summary</label>
              <input
                type="text"
                placeholder="A concise one-line value proposition of this course"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                >
                  <option value="all_levels">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Course Description *</label>
              <textarea
                rows={5}
                required
                placeholder="Detailed curriculum overview, topics covered, practical exercises..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: COURSE DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#14213D]">Step 2: Learning Objectives & Requirements</h3>

            {/* Objectives */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">What Will Students Learn?</label>
                <button
                  type="button"
                  onClick={addObjective}
                  className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Objective
                </button>
              </div>
              {formData.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => updateObjective(i, e.target.value)}
                    placeholder="e.g. Architect normalized database schemas"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeObjective(i)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Course Prerequisites</label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Prerequisite
                </button>
              </div>
              {formData.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder="e.g. Basic command line usage"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(i)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Target Audience & Estimated Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Estimated Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COURSE MEDIA */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#14213D]">Step 3: Course Media & Preview</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Course Thumbnail Image URL</label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
              />
              <div className="mt-3 aspect-video max-w-sm rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">Promotional Trailer Video URL (MP4)</label>
              <input
                type="url"
                value={formData.promo_video_url}
                onChange={(e) => setFormData({ ...formData, promo_video_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 4: COURSE PRICING */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#14213D]">Step 4: Course Pricing & Enrollment Model</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_free: true, price: 0 })}
                className={`p-6 rounded-3xl border text-center transition-all ${
                  formData.is_free
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-extrabold text-emerald-700 block">Free Course</span>
                <span className="text-xs text-slate-500 mt-1 block">Students enroll immediately at zero charge</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_free: false, price: formData.price || 1500 })}
                className={`p-6 rounded-3xl border text-center transition-all ${
                  !formData.is_free
                    ? 'border-[#6C63FF] bg-[#6C63FF]/5 shadow-md ring-2 ring-[#6C63FF]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-extrabold text-[#14213D] block">Paid Course</span>
                <span className="text-xs text-slate-500 mt-1 block">Requires payment verification via Chapa or Telebirr</span>
              </button>
            </div>

            {!formData.is_free && (
              <div className="max-w-xs space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Course Price (ETB)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-[#14213D] focus:outline-none focus:border-[#6C63FF]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ETB
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: COURSE CONTENT & MODULE PREVIEW */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#14213D]">Step 5: Curriculum Modules & Lessons</h3>
            <p className="text-xs text-slate-500">
              Your initial course shell will be created with Module 1. You can add video lectures, downloadable PDFs, quizzes, and assignments right after publishing.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#6C63FF]" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Module 1: Introduction & Foundations</h4>
                  <p className="text-[11px] text-indigo-700">Default starting module configured</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#6C63FF] bg-white px-2 py-1 rounded-full border border-indigo-200">
                Ready to Populate
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: PUBLISH & CONFIRMATION */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#14213D]">Step 6: Review Summary & Publish</h3>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Title</span>
                <h4 className="text-base font-bold text-[#14213D]">{formData.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{formData.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Level</span>
                  <strong className="text-slate-800 uppercase">{formData.level}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Language</span>
                  <strong className="text-slate-800">{formData.language}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Duration</span>
                  <strong className="text-slate-800">{formData.duration_hours} Hours</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Tuition</span>
                  <strong className="text-[#6C63FF]">
                    {formData.is_free ? 'Free' : `${Number(formData.price).toLocaleString()} ETB`}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleFinalSubmit('published')}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                {submitting ? 'Publishing Course...' : 'Publish Course Immediately'}
              </button>

              <button
                type="button"
                onClick={() => handleFinalSubmit('draft')}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </div>
        )}

        {/* Navigation Next / Prev Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 6 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors shadow-sm"
            >
              Continue to Step {currentStep + 1}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
