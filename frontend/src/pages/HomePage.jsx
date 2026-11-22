import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  PlayCircle,
  GraduationCap,
  Layers,
  Code2,
  Brain,
  Smartphone,
  Cloud,
  Palette,
  Briefcase
} from 'lucide-react';

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catsRes] = await Promise.all([
          api.get('/courses/featured'),
          api.get('/courses/categories'),
        ]);
        setFeaturedCourses(coursesRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-6 h-6 text-[#6C63FF]" />;
      case 'Brain': return <Brain className="w-6 h-6 text-[#3B82F6]" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-emerald-500" />;
      case 'Cloud': return <Cloud className="w-6 h-6 text-amber-500" />;
      case 'Palette': return <Palette className="w-6 h-6 text-rose-500" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-indigo-500" />;
      default: return <BookOpen className="w-6 h-6 text-[#6C63FF]" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-12 pb-24 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#6C63FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-xs font-bold text-[#6C63FF]">
                <Sparkles className="w-4 h-4 text-[#6C63FF]" />
                Next-Generation Learning Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#14213D] tracking-tight leading-[1.15]">
                Unlock Your Potential <br className="hidden sm:inline" />
                Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#3B82F6]">Learning</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover quality courses, learn from experienced instructors, develop high-demand software engineering and technology skills, and achieve your professional goals with Temesgen LMS.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#14213D] via-[#1e3a8a] to-[#6C63FF] text-white text-sm font-bold shadow-lg shadow-indigo-950/20 hover:shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/register?role=instructor"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 text-[#14213D] text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm text-center"
                >
                  Become an Instructor
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Accredited PDF Certificates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Hands-on Quizzes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ethiopian Payment Support</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Card Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-3">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                    alt="Students learning with Temesgen LMS"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  
                  {/* Floating Stat Pill 1 */}
                  <div className="absolute top-8 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Verified Graduates</p>
                      <p className="text-sm font-extrabold text-[#14213D]">2,400+ Alumni</p>
                    </div>
                  </div>

                  {/* Floating Stat Pill 2 */}
                  <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF]">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Instructor Rating</p>
                      <p className="text-sm font-extrabold text-[#14213D]">4.9 / 5.0 Stars</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14213D] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          <div className="text-center pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              5,000+
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Active Students</p>
          </div>
          <div className="text-center pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              50+
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Curated Tech Courses</p>
          </div>
          <div className="text-center pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              98.4%
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Course Completion Rate</p>
          </div>
          <div className="text-center pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              100%
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Verified Certification</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Explore by Interest</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">Popular Categories</h2>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 text-sm font-bold text-[#6C63FF] hover:text-[#3B82F6] flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.slug}`}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-[#6C63FF] shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="text-lg font-bold text-[#14213D] group-hover:text-[#6C63FF] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{cat.courses_count || 0} Courses</span>
                <span className="text-[#6C63FF] group-hover:translate-x-1 transition-transform">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">Featured Courses</h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked masterclasses taught by top software architects and instructors.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 text-sm font-bold text-[#6C63FF] hover:text-[#3B82F6] flex items-center gap-1"
          >
            Browse All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured courses..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE TEMESGEN LMS? */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Built for Excellence</span>
            <h2 className="text-3xl font-extrabold text-[#14213D] mt-1">Why Choose Temesgen LMS?</h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed from the ground up for serious learners and high-impact software careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D]">Enterprise-Grade Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step modular lessons covering normalized databases, secure Sanctum tokens, role-based controls, and reactive component trees.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D]">Cryptographic Certifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Earn verifiable certificates of completion with unique identification hashes that employers can authenticate online at any time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D]">Assessments & Assignments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test your knowledge with auto-graded quizzes and receive detailed feedback on real coding assignments from certified instructors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Simple & Seamless</span>
          <h2 className="text-3xl font-extrabold text-[#14213D] mt-1">How Temesgen LMS Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#14213D] text-white flex items-center justify-center text-xl font-extrabold shadow-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Discover & Enroll</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse our course catalog, choose free courses or enroll in paid masterclasses securely using local payment options.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center text-xl font-extrabold shadow-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Learn & Complete Tasks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Watch high-definition lessons, download resources, take quizzes, and submit assignments to track your learning progress.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center text-xl font-extrabold shadow-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Earn Your Certificate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon 100% course completion, your official certificate is generated instantly with public verification and shareable credentials.
            </p>
          </div>
        </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Social Proof</span>
          <h2 className="text-3xl font-extrabold text-[#14213D] mt-1">What Our Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "The Full-Stack Laravel 12 & React Masterclass gave me the exact confidence I needed to land my first full-stack engineering role. The focus on architecture and normalized databases is unparalleled."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
                alt="Abebe Bikila"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-[#14213D]">Abebe Bikila</p>
                <p className="text-xs text-slate-400">Junior Full-Stack Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Translating Figma design systems to clean Tailwind components was always a challenge until Sarah's UI/UX course. The interactive quizzes and feedback really helped reinforce the standards."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                alt="Bethlehem Desta"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-[#14213D]">Bethlehem Desta</p>
                <p className="text-xs text-slate-400">Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#14213D] via-[#1e3a8a] to-[#6C63FF] p-10 sm:p-16 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Join thousands of learners building their future today. Sign up for free and explore industry-leading courses.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#14213D] text-sm font-extrabold hover:bg-slate-100 transition-colors shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-colors"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
