import React from 'react';
import { BookOpen, Users, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ThreeLsBanner({ activePrinciple, onSelect, compact = false }) {
  const principles = [
    {
      id: 'learn',
      title: 'LEARN',
      subtitle: 'Knowledge Acquisition',
      desc: 'Interactive courses, video lessons, downloadable guides & personalized learning paths.',
      icon: BookOpen,
      gradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      ring: 'ring-indigo-500',
      badge: 'Step 1: Acquire',
    },
    {
      id: 'link',
      title: 'LINK',
      subtitle: 'Social Collaboration',
      desc: '1-on-1 instructor messaging, course discussion forums, and peer study groups.',
      icon: Users,
      gradient: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      ring: 'ring-emerald-500',
      badge: 'Step 2: Connect',
    },
    {
      id: 'lead',
      title: 'LEAD',
      subtitle: 'Skill Demonstration',
      desc: 'Real-world projects, mentor evaluations, verified skill tracking & achievement badges.',
      icon: Rocket,
      gradient: 'from-amber-500 to-rose-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      ring: 'ring-amber-500',
      badge: 'Step 3: Master',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {principles.map((p) => {
          const Icon = p.icon;
          const isSelected = activePrinciple === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect && onSelect(p.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                isSelected
                  ? `bg-white dark:bg-slate-800 shadow-md ring-2 ${p.ring} border-transparent`
                  : 'bg-white/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 truncate">
                    • {p.subtitle}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {p.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#14213D] to-slate-900 text-white shadow-xl border border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#6C63FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/15 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Educational Philosophy</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              The 3 L's Learning Framework
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Engineered so students can <strong className="text-white">Acquire Knowledge (Learn)</strong>, <strong className="text-white">Connect with Others (Link)</strong>, and <strong className="text-white">Demonstrate Practical Skills (Lead)</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {principles.map((p) => {
            const Icon = p.icon;
            const isSelected = activePrinciple === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelect && onSelect(p.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border-white/30 shadow-lg ring-2 ring-white/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  {p.title}
                  <span className="text-xs font-normal text-slate-300">— {p.subtitle}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
