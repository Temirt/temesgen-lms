import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('chapa');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
        setIsEnrolled(res.data.is_enrolled);

        // Expand first module by default
        if (res.data.course?.modules?.length > 0) {
          setExpandedModules({ [res.data.course.modules[0].id]: true });
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleEnrollFree = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }

    try {
      setPaymentProcessing(true);
      await api.post(`/courses/${course.id}/enroll`);
      setIsEnrolled(true);
      setEnrollSuccess(true);
      setTimeout(() => {
        navigate(`/learn/${course.id}`);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaidEnrollment = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }

    setPaymentError('');
    setPaymentProcessing(true);

    try {
      // 1. Initiate payment on backend
      const initRes = await api.post('/payments/initiate', {
        course_id: course.id,
        provider: selectedProvider,
      });

      const txRef = initRes.data.transaction_reference;

      // 2. Simulate gateway handshake and verify on backend
      // Backend enforces payment verification before activating enrollment
      const verifyRes = await api.post('/payments/verify', {
        transaction_reference: txRef,
      });

      setIsEnrolled(true);
      setPaymentModalOpen(false);
      setEnrollSuccess(true);

      setTimeout(() => {
        navigate(`/learn/${course.id}`);
      }, 1200);
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment processing error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#14213D]">Course not found</h2>
        <Link to="/courses" className="mt-4 inline-block text-[#6C63FF] hover:underline font-bold text-sm">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Top Hero Banner */}
      <section className="bg-[#14213D] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <Badge variant="secondary" size="md">
                    {course.category.name}
                  </Badge>
                )}
                <Badge variant="primary" size="md">
                  {course.level?.toUpperCase()}
                </Badge>
                {course.is_featured && (
                  <Badge variant="warning" size="md">
                    FEATURED
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
                  {course.subtitle}
                </p>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.average_rating || 5.0}</span>
                  <span className="text-slate-400 font-normal">({course.reviews_count || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{course.duration_hours || 10} total hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{course.total_lessons_count || 12} lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Certificate included</span>
                </div>
              </div>

              {/* Instructor snippet */}
              {course.instructor && (
                <div className="flex items-center gap-3 pt-3">
                  <img
                    src={course.instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <span className="text-xs text-slate-400 block">Created by</span>
                    <span className="text-sm font-bold text-white">{course.instructor.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Content & Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Details, Objectives, Curriculum, Reviews */}
          <div className="lg:col-span-8 space-y-10">
            {/* Success Alert if just enrolled */}
            {enrollSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-pulse">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>You are successfully enrolled! Redirecting to classroom...</span>
              </div>
            )}

            {/* What you'll learn (Objectives) */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-[#14213D]">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Description */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#14213D]">Course Description</h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Course Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-[#14213D]">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-xs text-slate-600">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Curriculum Modules & Lessons */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#14213D]">Course Curriculum</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {course.modules?.length || 0} modules • {course.total_lessons_count || 0} total lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.modules?.map((mod, index) => {
                  const isExpanded = !!expandedModules[mod.id];
                  return (
                    <div key={mod.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-[#14213D]">{mod.title}</h4>
                            <span className="text-[11px] text-slate-500">
                              {mod.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {mod.lessons?.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3.5 pl-6 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <PlayCircle className="w-4 h-4 text-[#6C63FF]" />
                                <span className="font-medium text-slate-800">{lesson.title}</span>
                                {lesson.is_preview && (
                                  <span className="text-[10px] font-bold text-[#3B82F6] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                    Preview Free
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 font-medium">
                                {lesson.duration_minutes} min
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor Profile */}
            {course.instructor && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-[#14213D]">Your Instructor</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={course.instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-base font-bold text-[#14213D]">{course.instructor.name}</h4>
                    <p className="text-xs text-[#6C63FF] font-semibold">{course.instructor.headline}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Student Reviews */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#14213D]">Student Feedback & Reviews</h3>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.average_rating || 5.0} Course Rating</span>
                </div>
              </div>

              <div className="space-y-4">
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={rev.user?.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">{rev.user?.name}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">{rev.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No reviews yet for this course.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6">
              {/* Promotional Video preview / thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white group-hover:scale-110 transition-transform shadow-lg" />
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tuition</span>
                  <div className="text-3xl font-extrabold text-[#14213D]">
                    {course.is_free || Number(course.price) === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      <span>{Number(course.price).toLocaleString()} <span className="text-sm font-bold text-slate-500">ETB</span></span>
                    )}
                  </div>
                </div>
                <Badge variant={course.is_free ? 'success' : 'primary'} size="sm">
                  {course.is_free ? 'Free Access' : 'Full Lifetime Access'}
                </Badge>
              </div>

              {/* Enroll Button State */}
              <div>
                {isEnrolled ? (
                  <Link
                    to={`/learn/${course.id}`}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-extrabold shadow-lg shadow-emerald-950/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Go to Classroom
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : course.is_free || Number(course.price) === 0 ? (
                  <button
                    onClick={handleEnrollFree}
                    disabled={paymentProcessing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#14213D] via-[#1e3a8a] to-[#6C63FF] text-white text-sm font-extrabold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {paymentProcessing ? 'Enrolling...' : 'Enroll Now (Free)'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#14213D] via-[#1e3a8a] to-[#6C63FF] text-white text-sm font-extrabold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Enroll Now ({Number(course.price).toLocaleString()} ETB)
                  </button>
                )}
              </div>

              {/* Included perks */}
              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">This Course Includes:</p>
                <div className="flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-[#6C63FF]" />
                  <span>{course.duration_hours || 10} hours of on-demand HD video</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#6C63FF]" />
                  <span>{course.total_lessons_count || 12} downloadable resources & guides</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#6C63FF]" />
                  <span>Official Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#6C63FF]" />
                  <span>Full lifetime access on desktop and mobile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Initiation & Verification Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Secure Course Enrollment Checkout"
        size="md"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Selected Course</p>
              <h4 className="text-sm font-bold text-[#14213D] line-clamp-1">{course.title}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Total Price</span>
              <p className="text-base font-extrabold text-[#14213D]">
                {Number(course.price).toLocaleString()} ETB
              </p>
            </div>
          </div>

          {/* Payment Gateway Options (Chapa, Telebirr) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              Select Ethiopian Payment Provider:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProvider('chapa')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedProvider === 'chapa'
                    ? 'border-[#6C63FF] bg-[#6C63FF]/5 shadow-sm ring-2 ring-[#6C63FF]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-extrabold text-[#14213D] block">Chapa Pay</span>
                <span className="text-[10px] text-slate-500">CBE, Awash, Telebirr & Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('telebirr')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedProvider === 'telebirr'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/5 shadow-sm ring-2 ring-[#3B82F6]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-extrabold text-[#14213D] block">Telebirr SuperApp</span>
                <span className="text-[10px] text-slate-500">Direct Mobile Account Transfer</span>
              </button>
            </div>
          </div>

          {paymentError && (
            <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {paymentError}
            </p>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            <strong>Security Notice:</strong> The backend generates a signed transaction reference and verifies with the payment provider. Enrollment is activated only upon verified payment confirmation.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePaidEnrollment}
              disabled={paymentProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-extrabold hover:bg-[#6C63FF] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {paymentProcessing ? 'Verifying Payment...' : `Complete Payment (${Number(course.price).toLocaleString()} ETB)`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
