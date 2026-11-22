import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Pagination from '../../components/Pagination';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/payments/history', { params: { page } });
      setPayments(res.data.data || []);
      setPagination({
        currentPage: res.data.current_page || 1,
        lastPage: res.data.last_page || 1,
        total: res.data.total || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#14213D]">Payment & Transaction Auditing</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited records of verified transactions through Ethiopian gateways (Chapa, Telebirr).
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading payment ledger..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction Ref</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Gateway</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-4 px-6 font-mono font-bold text-[#6C63FF]">
                      {p.transaction_id}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {p.course?.title || 'Course'}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-[#14213D]">
                      {Number(p.amount).toLocaleString()} {p.currency}
                    </td>
                    <td className="py-4 px-6 capitalize font-semibold text-slate-700">
                      {p.provider}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={pagination.currentPage}
              lastPage={pagination.lastPage}
              onPageChange={(pg) => fetchPayments(pg)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
