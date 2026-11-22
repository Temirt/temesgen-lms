import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14213D] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-[#6C63FF]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight block leading-none">
                  Temesgen <span className="text-[#6C63FF]">LMS</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">
                  Learn. Grow. Achieve.
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Temesgen LMS is a premier modern learning management platform engineered to deliver world-class digital education, practical software engineering skills, and career-defining certificates.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                <span>Verified Certifications</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <span>Ethiopian Payment Gateways</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">All Courses</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-white transition-colors">Verify Certificate</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/courses?category=web-development" className="hover:text-white transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/courses?category=data-science-ai" className="hover:text-white transition-colors">Data Science & AI</Link>
              </li>
              <li>
                <Link to="/courses?category=cloud-devops" className="hover:text-white transition-colors">Cloud & DevOps</Link>
              </li>
              <li>
                <Link to="/courses?category=ui-ux-design" className="hover:text-white transition-colors">UI/UX Design</Link>
              </li>
              <li>
                <Link to="/courses?category=mobile-development" className="hover:text-white transition-colors">Mobile Apps</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6C63FF] shrink-0" />
                <span>support@temesgenlms.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6C63FF] shrink-0" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6C63FF] shrink-0 mt-0.5" />
                <span>Bole Sub-City, Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Temesgen LMS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Temesgen LMS Architecture Team
          </p>
        </div>
      </div>
    </footer>
  );
}
