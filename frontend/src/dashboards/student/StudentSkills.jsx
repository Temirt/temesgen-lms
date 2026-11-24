import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Rocket,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Server,
  Database,
  Layout,
  Box,
  GitBranch,
  BarChart2,
  Palette,
  Sparkles,
} from 'lucide-react';

export default function StudentSkills() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/skills');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case 'Server':
        return Server;
      case 'Database':
        return Database;
      case 'Layout':
        return Layout;
      case 'Box':
        return Box;
      case 'GitBranch':
        return GitBranch;
      case 'BarChart2':
        return BarChart2;
      case 'Palette':
        return Palette;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Award;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'mastered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'proficient':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Computing skill competency matrix..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200/60 dark:border-amber-800/50 mb-2">
          <Rocket className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Principle 3: LEAD</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Skill Development Tracking & Mastery
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Quantified proficiency benchmarks verified through completed capstones, quizzes, and code assessments.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Overall Competency
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.average_proficiency}%
          </p>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Across 8 Core Disciplines
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Mastered Skills
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {data.mastered_count}
          </p>
          <span className="text-xs text-slate-400 font-semibold mt-1 block">
            &gt; 80% Performance Index
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Proficient Skills
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {data.proficient_count}
          </p>
          <span className="text-xs text-slate-400 font-semibold mt-1 block">
            60% - 80% Working Knowledge
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            In Development
          </span>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {data.developing_count}
          </p>
          <span className="text-xs text-slate-400 font-semibold mt-1 block">
            Active Study Goals
          </span>
        </div>
      </div>

      {/* Skills Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.skills.map((skill) => {
          const Icon = getSkillIcon(skill.icon);
          const badgeClass = getStatusBadge(skill.status);

          return (
            <div
              key={skill.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {skill.proficiency_level}%
                  </span>
                  <span className={`block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${badgeClass}`}>
                    {skill.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {skill.description}
              </p>

              {/* Progress gauge */}
              <div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      skill.proficiency_level >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : skill.proficiency_level >= 60
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${skill.proficiency_level}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {skill.verified_projects_count} Capstone Audits
                </span>
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  {skill.proficiency_level >= 80 ? 'Production Ready' : 'In Mentorship'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
