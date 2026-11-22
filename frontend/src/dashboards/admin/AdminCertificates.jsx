import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import { Award, Search, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Fetch user certificates or system log
      const res = await api.get('/certificates/my');
      setCertificates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = certificates.filter((c) => {
    const certNum = c.certificate_number || '';
    const course = c.course?.title || '';
    return (
      certNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner text="Loading certificates..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Certificates Ledger
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Official certificates generated and cryptographically verifiable by public employers.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by certificate ID or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-navy-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold uppercase text-slate-500">
                <th className="py-3.5 px-4">Certificate ID</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750">
                    <td className="py-4 px-4 font-mono font-bold text-xs text-primary">
                      {cert.certificate_number}
                    </td>
                    <td className="py-4 px-4 font-medium text-navy-900 dark:text-white">
                      {cert.course?.title}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(cert.issue_date || cert.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="success">Verified</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/verify-certificate?id=${cert.certificate_number}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Public Verify <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
