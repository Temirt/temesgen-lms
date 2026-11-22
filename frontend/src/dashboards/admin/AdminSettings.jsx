import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platform_name: 'Temesgen LMS',
    platform_tagline: 'Learn. Grow. Achieve.',
    contact_email: 'contact@temesgenlms.com',
    contact_phone: '+251 911 234 567',
    currency: 'ETB',
    course_auto_approval: '0',
    enable_chapa: '1',
    enable_telebirr: '1',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings')
      .then((res) => {
        if (res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading platform configuration..." />;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#14213D]">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure application brand identity, payment gateways, and moderation policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#14213D] uppercase tracking-wider">General Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name || ''}
                onChange={(e) => handleChange('platform_name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={settings.platform_tagline || ''}
                onChange={(e) => handleChange('platform_tagline', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-[#14213D] uppercase tracking-wider">Payment & Currency</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Currency</label>
              <input
                type="text"
                value={settings.currency || 'ETB'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Enable Chapa Gateway</label>
              <select
                value={settings.enable_chapa || '1'}
                onChange={(e) => handleChange('enable_chapa', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                <option value="1">Enabled (Active)</option>
                <option value="0">Disabled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Enable Telebirr Gateway</label>
              <select
                value={settings.enable_telebirr || '1'}
                onChange={(e) => handleChange('enable_telebirr', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                <option value="1">Enabled (Active)</option>
                <option value="0">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
