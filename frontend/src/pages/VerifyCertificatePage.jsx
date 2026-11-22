import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  BookOpen,
  Printer
} from 'lucide-react';

export default function VerifyCertificatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const certIdParam = searchParams.get('id') || searchParams.get('number') || '';

  const [inputNumber, setInputNumber] = useState(certIdParam);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const verifyNumber = async (num) => {
    if (!num) return;
    setLoading(true);
    setSearched(true);
    setErrorMsg('');
    setCertificate(null);

    try {
      const res = await api.get(`/certificates/verify?number=${encodeURIComponent(num.trim())}`);
      setCertificate(res.data.certificate);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Certificate not found with this identifier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certIdParam) {
      setInputNumber(certIdParam);
      verifyNumber(certIdParam);
    }
  }, [certIdParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputNumber) {
      setSearchParams({ id: inputNumber.trim() });
      verifyNumber(inputNumber.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D]">
          Official Certificate Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Temesgen LMS cryptographically verifies credentials issued to students and graduates. Enter the unique Certificate ID to validate authenticity.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. TLMS-2026-A89F31"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#6C63FF]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors shadow-sm"
          >
            Verify
          </button>
        </form>
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          Sample verified ID for testing: <strong className="text-slate-700 font-mono">TLMS-2026-A89F31</strong>
        </p>
      </div>

      {loading && <LoadingSpinner text="Querying verification database..." />}

      {/* Result Display */}
      {searched && !loading && (
        <div>
          {certificate ? (
            <div className="space-y-6">
              {/* Authenticated Pill */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Valid & Authenticated Certificate</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
              </div>

              {/* Certificate Template Card */}
              <div className="bg-white rounded-3xl border-8 border-double border-[#14213D] p-8 sm:p-14 shadow-2xl relative overflow-hidden print:border-none print:shadow-none">
                {/* Background watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Award className="w-[500px] h-[500px]" />
                </div>

                <div className="relative text-center space-y-6">
                  {/* Header Logo */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#14213D] text-white flex items-center justify-center font-bold">
                      T
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#14213D]">
                      TEMESGEN <span className="text-[#6C63FF]">LMS</span>
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
                    Certificate of Completion
                  </p>

                  <div className="pt-2">
                    <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-serif tracking-wide mt-2">
                      {certificate.student_name}
                    </h2>
                    <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent mx-auto mt-2" />
                  </div>

                  <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                    For successfully mastering and completing all required lectures, assessments, and projects for
                  </p>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#14213D]">
                    {certificate.course_title}
                  </h3>

                  {/* Footer Credentials */}
                  <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Instructor</span>
                      <strong className="text-slate-800">{certificate.instructor_name}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
                      <strong className="text-slate-800">{certificate.issue_date}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Certificate ID</span>
                      <strong className="font-mono text-[#6C63FF]">{certificate.certificate_number}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D]">Certificate Not Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {errorMsg || 'No record matches this ID. Please double check the ID format and try again.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
