import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  GraduationCap,
} from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setProfileError('');
      const res = await api.put('/profile', profileData);
      setProfileSuccess('Profile details saved successfully!');
      localStorage.setItem('temesgen_lms_user', JSON.stringify(res.data.user || res.data));
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.new_password_confirmation) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordError('');
      await api.put('/password', passwords);
      setPasswordSuccess('Password changed successfully!');
      setPasswords({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Student Profile & Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update personal information, profile photo, and secure your learning account.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm">
        <h2 className="text-base font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Personal Learning Profile
        </h2>

        {profileSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {profileError}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <img
              src={
                profileData.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profileData.name || 'Student'
                )}&background=14213d&color=fff`
              }
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Headline / Current Role
              </label>
              <input
                type="text"
                placeholder="e.g. Aspiring Full-Stack Developer | CS Student"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+251 9..."
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              About Me / Bio
            </label>
            <textarea
              rows="3"
              placeholder="Tell instructors and fellow students about your background and learning goals..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-sm text-sm transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm">
        <h2 className="text-base font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          Change Password
        </h2>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength="8"
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength="8"
                value={passwords.new_password_confirmation}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password_confirmation: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-navy-900 shadow-sm text-sm transition-colors disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
