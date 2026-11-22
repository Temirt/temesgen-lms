import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  Bell,
  CheckCheck,
  CheckCircle,
  Calendar,
  ExternalLink,
  Info,
  Award,
  BookOpen,
} from 'lucide-react';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return <LoadingSpinner text="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stay updated with grading feedback, course announcements, and system alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
            No notifications
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filter === 'unread'
              ? "You don't have any unread notifications."
              : 'You have no notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const isUnread = !n.is_read;

            return (
              <div
                key={n.id}
                onClick={() => isUnread && handleMarkAsRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  isUnread
                    ? 'bg-primary/5 dark:bg-primary/10 border-primary/30 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isUnread
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                        {n.title}
                      </h4>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                      {n.link && (
                        <Link
                          to={n.link}
                          className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open Link <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(n.id);
                    }}
                    className="text-xs text-slate-400 hover:text-primary shrink-0"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
