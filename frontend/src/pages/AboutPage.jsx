import React from 'react';
import { BookOpen, Award, Users, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="bg-[#14213D] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">
            Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Empowering the Next Generation of Tech Leaders
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Temesgen LMS was conceived to bridge the gap between academic theory and enterprise software engineering excellence.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Practical Mastery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We teach modern architectures: normalized relational schemas, token-based authentication, and reactive interfaces built for scale.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Trust & Authenticity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every certificate issued is recorded on the database with a tamper-resistant hash that employers can verify publicly in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">Community & Inclusivity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supporting local payment providers like Chapa and Telebirr to ensure accessible educational opportunities across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership / Instructors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">Leadership & Instructors</h2>
          <p className="text-xs text-slate-500 mt-2">
            Industry practitioners and educators passionate about digital empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
              alt="Dr. Temesgen Abebe"
              className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[#6C63FF]"
            />
            <h4 className="text-base font-bold text-[#14213D]">Dr. Temesgen Abebe</h4>
            <p className="text-xs font-semibold text-[#6C63FF]">Lead Architect & Instructor</p>
            <p className="text-xs text-slate-500">12+ years in full-stack cloud backends and AI systems.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
              alt="Sarah Jenkins"
              className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[#3B82F6]"
            />
            <h4 className="text-base font-bold text-[#14213D]">Sarah Jenkins</h4>
            <p className="text-xs font-semibold text-[#3B82F6]">UI/UX Design Lead</p>
            <p className="text-xs text-slate-500">Pioneering accessible, human-centric design systems.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
              alt="Temesgen Admin"
              className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-emerald-500"
            />
            <h4 className="text-base font-bold text-[#14213D]">Temesgen Admin</h4>
            <p className="text-xs font-semibold text-emerald-600">Platform Director</p>
            <p className="text-xs text-slate-500">Managing curriculum quality and educational compliance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
