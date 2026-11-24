import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Rocket,
  Github,
  Globe,
  Award,
  CheckCircle2,
  Clock,
  Send,
  FileCode,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [architectureNotes, setArchitectureNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const openSubmit = (project) => {
    setSelectedProject(project);
    if (project.submission) {
      setGithubUrl(project.submission.github_url || '');
      setLiveDemoUrl(project.submission.live_demo_url || '');
      setArchitectureNotes(project.submission.architecture_notes || '');
    } else {
      setGithubUrl('');
      setLiveDemoUrl('');
      setArchitectureNotes('');
    }
    setShowSubmitModal(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!selectedProject || !githubUrl.trim() || !architectureNotes.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/projects/${selectedProject.id}/submit`, {
        github_url: githubUrl.trim(),
        live_demo_url: liveDemoUrl.trim() || null,
        architecture_notes: architectureNotes.trim(),
      });
      setShowSubmitModal(false);
      setNotification({
        type: 'success',
        message: 'Project submitted successfully for instructor evaluation!',
      });
      fetchProjects();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit project.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading real-world projects..." />;
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
          Real-World Capstone Projects
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Demonstrate practical engineering mastery by constructing industry-standard software solutions, audited and graded by expert mentors.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-sm font-black">&times;</button>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const submission = proj.submission;
          const isGraded = submission?.status === 'graded';

          return (
            <div
              key={proj.id}
              className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Status & Difficulty */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {proj.course?.title}
                  </span>

                  {submission ? (
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        isGraded
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isGraded ? `Score: ${submission.score}/100` : 'Under Evaluation'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {proj.difficulty} • ~{proj.estimated_hours} Hours
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Real-World Industry Scenario */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-4">
                  <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    Industry Scenario:
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{proj.scenario}"
                  </p>
                </div>

                {/* Requirements */}
                {proj.requirements && (
                  <div className="mb-4">
                    <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Core Requirements:
                    </h4>
                    <ul className="space-y-1.5">
                      {proj.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Developed Tags */}
                {proj.skills_developed && (
                  <div className="mb-4">
                    <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Demonstrated Competencies:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skills_developed.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Graded Evaluation Box if graded */}
                {isGraded && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Instructor Mentor Evaluation
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                        {submission.score}% Passed
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{submission.evaluation_feedback}"
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      {submission.github_url && (
                        <a
                          href={submission.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600"
                        >
                          <Github className="w-3.5 h-3.5" /> Repository
                        </a>
                      )}
                      {submission.live_demo_url && (
                        <a
                          href={submission.live_demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600"
                        >
                          <Globe className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit / Edit Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openSubmit(proj)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isGraded
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200'
                      : submission
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-600 dark:hover:bg-amber-50'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  <span>
                    {isGraded ? 'Review Submission Details' : submission ? 'Update Project Submission' : 'Submit Capstone Project'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Submit Real-World Project
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedProject.title}
            </p>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL *
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Live Deployed URL (Optional)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://my-demo-app.vercel.app"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Architecture & Technical Implementation Notes *
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail your database normalization, API Sanctum tokens, error recovery, and how you verified requirements..."
                  value={architectureNotes}
                  onChange={(e) => setArchitectureNotes(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit for Evaluation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
