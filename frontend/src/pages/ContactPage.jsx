import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D]">We'd Love to Hear From You</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have a question about courses, enterprise training, or instructor partnerships? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info sidebar */}
        <div className="lg:col-span-5 bg-[#14213D] text-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Fill out the form and our admissions team will respond within 24 hours.
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#6C63FF] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Email Address</p>
                <p className="mt-0.5">contact@temesgenlms.com</p>
                <p>admissions@temesgenlms.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#3B82F6] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Phone Number</p>
                <p className="mt-0.5">+251 911 234 567</p>
                <p>+251 116 890 123</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Headquarters</p>
                <p className="mt-0.5">Bole Medhanialem, Sub-City 03</p>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. One of our course coordinators will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Kebede"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
