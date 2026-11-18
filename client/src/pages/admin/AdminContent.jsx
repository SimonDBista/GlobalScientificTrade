import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Globe, Building, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function AdminContent() {
    const { settings: globalSettings, refreshSettings } = useSettings();

    const [formSettings, setFormSettings] = useState({
        company_name: '',
        company_tagline: '',
        company_address: '',
        company_phone: '',
        company_email: '',
        company_tiktok: '',
        about_story: '',
        announcement: ''
    });

    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (globalSettings) {
            setFormSettings({
                company_name: globalSettings.company_name || 'Global Scientific Trade Pvt. Ltd.',
                company_tagline: globalSettings.company_tagline || '',
                company_address: globalSettings.company_address || 'Swayambhu, Kathmandu, Nepal',
                company_phone: globalSettings.company_phone || '',
                company_email: globalSettings.company_email || '',
                company_tiktok: globalSettings.company_tiktok || '',
                about_story: globalSettings.about_story || '',
                announcement: globalSettings.announcement || ''
            });
        }
    }, [globalSettings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await api.updateContent(formSettings);
            await refreshSettings();
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update website content');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Website Content & Company Information
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage central business details, addresses, phone lines, and story text.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save All Content'}</span>
                </button>
            </div>

            {savedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Content settings updated successfully across the website!</span>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-brand-700" />
                    <span>Corporate Identity & Contact Office</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Company Legal Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formSettings.company_name}
                            onChange={(e) => setFormSettings({ ...formSettings, company_name: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tagline / Subheading
                        </label>
                        <input
                            type="text"
                            value={formSettings.company_tagline}
                            onChange={(e) => setFormSettings({ ...formSettings, company_tagline: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Office Locations (Kathmandu & Dhangadhi)
                        </label>
                        <input
                            type="text"
                            value={formSettings.company_address}
                            onChange={(e) => setFormSettings({ ...formSettings, company_address: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Contact Phones (Kathmandu & Dhangadhi)
                        </label>
                        <input
                            type="text"
                            value={formSettings.company_phone}
                            onChange={(e) => setFormSettings({ ...formSettings, company_phone: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden font-mono"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Official Email
                        </label>
                        <input
                            type="email"
                            value={formSettings.company_email}
                            onChange={(e) => setFormSettings({ ...formSettings, company_email: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            TikTok Social URL
                        </label>
                        <input
                            type="text"
                            value={formSettings.company_tiktok}
                            onChange={(e) => setFormSettings({ ...formSettings, company_tiktok: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Top Announcement / Header Notice
                    </label>
                    <input
                        type="text"
                        value={formSettings.announcement}
                        onChange={(e) => setFormSettings({ ...formSettings, announcement: e.target.value })}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Corporate "About Us" Story
                    </label>
                    <textarea
                        rows={5}
                        value={formSettings.about_story}
                        onChange={(e) => setFormSettings({ ...formSettings, about_story: e.target.value })}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none leading-relaxed"
                    />
                </div>
            </div>
        </form>
    );
}
