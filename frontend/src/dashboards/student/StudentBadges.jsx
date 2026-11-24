import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Award,
  BookOpen,
  MessageSquare,
  Rocket,
  Lock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Compass,
  Users,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

export default function StudentBadges() {
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/badges');
      setBadgeData(res.data);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'HelpCircle':
        return HelpCircle;
      case 'Compass':
        return Compass;
      case 'MessageSquare':
        return MessageSquare;
      case 'Users':
        return Users;
      case 'CheckCircle':
        return CheckCircle;
      case 'Rocket':
        return Rocket;
      case 'GraduationCap':
        return GraduationCap;
      default:
        return Award;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'indigo':
        return {
          gradient: 'from-indigo-500 to-blue-600',
          text: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          text: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-950/40',
        };
      case 'sky':
        return {
          gradient: 'from-sky-500 to-blue-600',
          text: 'text-sky-600 dark:text-sky-400',
          bg: 'bg-sky-50 dark:bg-sky-950/40',
        };
      case 'emerald':
      case 'teal':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          text: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        };
      case 'rose':
        return {
          gradient: 'from-rose-500 to-pink-600',
          text: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/40',
        };
      default: // amber
        return {
          gradient: 'from-amber-500 to-orange-600',
          text: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/40',
        };
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading achievement showcase..." />;
  }

  const displayedBadges =
    activeTab === 'all'
      ? badgeData.all
      : badgeData[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200/60 dark:border-amber-800/50 mb-2">
          <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Principle 3: LEAD</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Achievement Badges & Milestones
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Celebrate your progression across knowledge acquisition (Learn), community engagement (Link), and technical execution (Lead).
        </p>
      </div>

      {/* Overview Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#14213D] to-slate-900 text-white shadow-lg border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Accomplishment Summary
          </span>
          <h2 className="text-2xl font-black mt-1">
            {badgeData.earned_count} of {badgeData.total_badges} Badges Unlocked
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            You are in the top 10% of active full-stack engineering learners!
          </p>
        </div>

        <div className="w-48 bg-white/10 h-3 rounded-full overflow-hidden shrink-0 border border-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
            style={{ width: `${(badgeData.earned_count / badgeData.total_badges) * 100}%` }}
          />
        </div>
      </div>

      {/* Principle Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'learn', label: '📘 LEARN Badges' },
          { id: 'link', label: '💬 LINK Badges' },
          { id: 'lead', label: '🏆 LEAD Badges' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.icon);
          const colors = getColorClasses(badge.color);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                badge.is_earned
                  ? 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      badge.is_earned
                        ? `bg-gradient-to-br ${colors.gradient}`
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      badge.is_earned
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1'
                    }`}
                  >
                    {badge.is_earned ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {badge.principle} Milestone
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {badge.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              {/* Criteria */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Unlock Criteria:
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {badge.criteria}
                </p>
                {badge.is_earned && badge.awarded_at && (
                  <span className="block text-[10px] text-slate-400 mt-2">
                    Earned on {new Date(badge.awarded_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
