import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  Award,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Copy,
  Printer,
  Share2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates/my');
      setCertificates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (certNumber) => {
    const url = `${window.location.origin}/verify-certificate?id=${certNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certNumber);
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your verified credentials..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          My Verified Certificates
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Official, cryptographically verifiable certificates earned upon 100% course completion.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No certificates earned yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            Complete all lessons and quizzes in an enrolled course (100% progress) to automatically unlock your official certificate.
          </p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm"
          >
            <BookOpen className="w-4 h-4" /> Continue Learning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const verifyUrl = `/verify-certificate?id=${cert.certificate_number}`;

            return (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {/* Gold seal watermark */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-amber-500/10 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Award className="w-7 h-7" />
                    </span>
                    <Badge variant="success">Verified Authentic</Badge>
                  </div>

                  <div className="font-mono text-xs font-semibold text-primary mb-1">
                    ID: {cert.certificate_number}
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                    {cert.course?.title || 'Advanced Professional Certification'}
                  </h3>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued: {new Date(cert.issue_date || cert.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Instructor: {cert.course?.instructor?.name || 'Dr. Temesgen Abebe'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <Link
                    to={verifyUrl}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    View / Print
                  </Link>

                  <button
                    onClick={() => handleCopyLink(cert.certificate_number)}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                    title="Copy verification link"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedId === cert.certificate_number ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
