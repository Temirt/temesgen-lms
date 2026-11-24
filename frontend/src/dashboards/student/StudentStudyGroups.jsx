import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Users,
  Calendar,
  BookOpen,
  PlusCircle,
  MessageCircle,
  UserCheck,
  Send,
  X,
  Share2,
} from 'lucide-react';

export default function StudentStudyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGroupChat, setActiveGroupChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatText, setNewChatText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(1);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('Tuesdays & Thursdays, 7:00 PM EAT');
  const [maxMembers, setMaxMembers] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study-groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Error fetching study groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await api.post(`/study-groups/${groupId}/join`);
      fetchGroups();
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await api.post(`/study-groups/${groupId}/leave`);
      fetchGroups();
    } catch (err) {
      console.error('Error leaving group:', err);
    }
  };

  const openGroupChat = async (group) => {
    setActiveGroupChat(group);
    try {
      setLoadingChat(true);
      const res = await api.get(`/study-groups/${group.id}/messages`);
      setChatMessages(res.data.messages || []);
    } catch (err) {
      console.error('Error fetching group messages:', err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendGroupMessage = async (e) => {
    e.preventDefault();
    if (!newChatText.trim() || !activeGroupChat) return;

    try {
      const res = await api.post(`/study-groups/${activeGroupChat.id}/messages`, {
        message: newChatText.trim(),
      });
      setChatMessages((prev) => [...prev, res.data]);
      setNewChatText('');
    } catch (err) {
      console.error('Error posting message:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/study-groups', {
        course_id: courseId,
        name,
        topic,
        description,
        meeting_schedule: schedule,
        max_members: maxMembers,
      });
      setShowCreateModal(false);
      setName('');
      setTopic('');
      setDescription('');
      fetchGroups();
    } catch (err) {
      console.error('Error creating study group:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading study groups..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/50 mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Principle 2: LINK</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Student Study Groups & Peer Circles
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Form collaborative learning squads, review capstones together, and host scheduled weekly study meetups.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Study Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {group.course?.title || 'General'}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{group.members_count}/{group.max_members}</span>
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
                {group.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                Focus: {group.topic}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {group.description}
              </p>

              {/* Schedule */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2.5 text-xs">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">
                  {group.meeting_schedule}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              {group.is_member ? (
                <>
                  <button
                    onClick={() => openGroupChat(group)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open Group Hub</span>
                  </button>
                  <button
                    onClick={() => handleLeave(group.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors"
                  >
                    Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleJoin(group.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-50 text-xs font-bold transition-all shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Join Study Group</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Group Chat Modal */}
      {activeGroupChat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-2xl w-full h-[600px] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeGroupChat.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeGroupChat.meeting_schedule} • {activeGroupChat.members_count} active members
                </p>
              </div>
              <button
                onClick={() => setActiveGroupChat(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-900/10">
              {loadingChat ? (
                <LoadingSpinner text="Connecting to group channel..." />
              ) : chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No messages yet. Send a message to your group!
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMine = msg.user_id === user.id;
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {!isMine && (
                        <img
                          src={msg.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                          alt={msg.user?.name}
                          className="w-7 h-7 rounded-xl object-cover"
                        />
                      )}
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                      >
                        {!isMine && (
                          <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                            {msg.user?.name}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        <span className={`block text-[9px] mt-1 text-right ${isMine ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendGroupMessage} className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Post collaboration notes or meeting links..."
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={!newChatText.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Create a Student Study Group
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Gather your peers around a technical topic or capstone project.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Addis Ababa React Developers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specialized Study Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eloquent Indexing & API Tokens"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saturdays, 4:00 PM EAT"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Group Description & Goals
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain group objectives and peer code review expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  {submitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
