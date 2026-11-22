import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { History, Search } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/logs', {
        params: { page, search: search || undefined },
      });
      setLogs(res.data.data || []);
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
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D]">System Activity Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable security and event audit trail of administrative and student actions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchLogs(1);
          }}
          className="relative max-w-md"
        >
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#6C63FF]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#14213D] text-white text-xs font-semibold"
          >
            Filter
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Reading audit logs..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Event Action</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-sans">
                    <td className="py-4 px-6 font-mono font-bold text-[#6C63FF] text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {log.user ? `${log.user.name} (${log.user.role})` : 'System / Guest'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-md truncate">
                      {log.description}
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
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
              onPageChange={(p) => fetchLogs(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
