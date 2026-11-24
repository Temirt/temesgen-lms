import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import ThreeLsBanner from '../../components/ThreeLsBanner';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  FileText,
  ArrowRight,
  Sparkles,
  Calendar,
  Compass,
  Users,
  MessageSquare,
  Rocket,
  TrendingUp,
  Github,
  CheckCircle2,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrinciple, setSelectedPrinciple] = useState('learn');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your learning workspace..." />;
  }

  const stats = data?.stats || {
    enrolled_courses: 0,
    completed_courses: 0,
    learning_hours: 0,
    certificates_earned: 0,
  };

  const threeLs = stats.three_ls || {
    learn: { enrolled_courses: 0, learning_paths: 0, learning_hours: 0 },
    link: { unread_messages: 0, study_groups: 0, discussions: 0 },
    lead: { projects_submitted: 0, badges_earned: 0, skills_tracked: 0, certificates: 0 },
  };

  const continueLearning = data?.continue_learning || [];
  const upcomingAssignments = data?.upcoming_assignments || [];
  const leadProjects = data?.lead_projects || [];
  const topSkills = data?.top_skills || [];
  const recentBadges = data?.recent_badges || [];

  return (
    <div className="space-y-8">
      {/* 3 L's Educational Philosophy Banner */}
      <ThreeLsBanner
        activePrinciple={selectedPrinciple}
        onSelect={(principle) => setSelectedPrinciple(principle)}
      />

      {/* 3 L's Principle Quick Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <button
          onClick={() => setSelectedPrinciple('learn')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedPrinciple === 'learn'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. LEARN (Courses & Paths)</span>
        </button>

        <button
          onClick={() => setSelectedPrinciple('link')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedPrinciple === 'link'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. LINK (Community & Messages)</span>
        </button>

        <button
          onClick={() => setSelectedPrinciple('lead')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedPrinciple === 'lead'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>3. LEAD (Projects, Skills & Badges)</span>
        </button>
      </div>

      {/* 1. LEARN PRINCIPLE SECTION */}
      {selectedPrinciple === 'learn' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Enrolled Courses"
              value={threeLs.learn.enrolled_courses}
              icon={BookOpen}
              color="primary"
              change="Active coursework"
              isPositive={true}
            />
            <StatCard
              title="Personalized Paths"
              value={threeLs.learn.learning_paths || 1}
              icon={Compass}
              color="indigo"
              change="Architect pathways"
              isPositive={true}
            />
            <StatCard
              title="Learning Hours"
              value={`${threeLs.learn.learning_hours} hrs`}
              icon={Clock}
              color="amber"
              change="Watch time invested"
              isPositive={true}
            />
          </div>

          {/* Continue Learning Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Continue Interactive Learning
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick up video modules and reading lessons right where you left off
                </p>
              </div>
              <Link
                to="/student/courses"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                All Courses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {continueLearning.length === 0 ? (
              <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                You have not started any lessons yet. Explore our course catalog to begin!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {continueLearning.map((enr) => {
                  const c = enr.course;
                  if (!c) return null;
                  const progress = enr.progress_percentage || 0;

                  return (
                    <div
                      key={enr.id}
                      className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="flex gap-4 items-start">
                        <img
                          src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&crop=q=80'}
                          alt={c.title}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {c.category?.name || 'Full-Stack'}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 mb-1">
                            {c.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>By {c.instructor?.name || 'Instructor'}</span>
                            <span>•</span>
                            <span>{c.lessons_count || 10} lessons</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Auto-Save Progress</span>
                          <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            to={`/learn/${c.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>{progress > 0 ? 'Resume Lesson' : 'Start Course'}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LINK PRINCIPLE SECTION */}
      {selectedPrinciple === 'link' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Mentorship Messages"
              value={threeLs.link.unread_messages || 1}
              icon={MessageSquare}
              color="emerald"
              change="1-on-1 Discussions"
              isPositive={true}
            />
            <StatCard
              title="Study Circles"
              value={threeLs.link.study_groups || 1}
              icon={Users}
              color="teal"
              change="Active peer squads"
              isPositive={true}
            />
            <StatCard
              title="Course Forums"
              value={threeLs.link.discussions || 3}
              icon={HelpCircle}
              color="indigo"
              change="Community Q&A topics"
              isPositive={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                  Direct Instructor Messaging
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Message your course instructors directly to request feedback on architecture, token guards, or debugging.
                </p>
              </div>
              <Link
                to="/student/messages"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                <span>Open Direct Messages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                  Peer Study Groups
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Join scheduled weekly study squads, review Git codebases together, and collaborate on capstone requirements.
                </p>
              </div>
              <Link
                to="/student/study-groups"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
              >
                <span>Browse Study Circles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                  Course Discussion Forums
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse threaded technical questions, upvote top explanations, and read official instructor endorsements.
                </p>
              </div>
              <Link
                to="/student/discussions"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                <span>Explore Forums</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. LEAD PRINCIPLE SECTION */}
      {selectedPrinciple === 'lead' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Capstone Projects"
              value={threeLs.lead.projects_submitted || 1}
              icon={Rocket}
              color="amber"
              change="Real-World Submissions"
              isPositive={true}
            />
            <StatCard
              title="Skills Tracked"
              value={threeLs.lead.skills_tracked || 8}
              icon={TrendingUp}
              color="emerald"
              change="Quantified proficiency"
              isPositive={true}
            />
            <StatCard
              title="Badges Earned"
              value={threeLs.lead.badges_earned || 6}
              icon={Award}
              color="purple"
              change="Verified Milestones"
              isPositive={true}
            />
            <StatCard
              title="Certificates"
              value={threeLs.lead.certificates || 1}
              icon={CheckCircle}
              color="indigo"
              change="Publicly Verifiable"
              isPositive={true}
            />
          </div>

          {/* Real-World Projects Spotlight */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Real-World Project Demonstration
                </h3>
                <p className="text-xs text-slate-500">
                  Construct production-ready repositories and submit live URLs for mentor evaluation
                </p>
              </div>
              <Link
                to="/student/projects"
                className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                All Projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leadProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                      {proj.difficulty}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                  <div className="pt-3 flex justify-end">
                    <Link
                      to="/student/projects"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                    >
                      View & Submit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
