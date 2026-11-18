import React, { useState } from 'react';
import { Lock, Save, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
    const { admin } = useAuth();

    const [formData, setFormData] = useState({
        full_name: admin?.full_name || 'System Administrator',
        email: admin?.email || 'gsciencehouse2077@gmail.com',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.new_password) {
            if (!formData.current_password) {
                setError('Current password is required to set a new password.');
                return;
            }
            if (formData.new_password !== formData.confirm_password) {
                setError('New password and confirmation do not match.');
                return;
            }
            if (formData.new_password.length < 8) {
                setError('New password must be at least 8 characters long.');
                return;
            }
        }

        setSaving(true);
        try {
            await api.updateProfile({
                full_name: formData.full_name,
                email: formData.email,
                current_password: formData.current_password,
                new_password: formData.new_password
            });
            setSavedMsg(true);
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_password: ''
            }));
            setTimeout(() => setSavedMsg(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update admin profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto pb-16">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Admin Profile & Security
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                    Update administrative credentials and access security.
                </p>
            </div>

            {savedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Credentials updated successfully!</span>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Administrator Email
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-brand-700" />
                        <span>Change Password (Leave blank to keep existing)</span>
                    </h4>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={formData.current_password}
                            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            New Password (min 8 characters)
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={formData.new_password}
                            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-hidden"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50"
                    >
                        {saving ? 'Updating...' : 'Update Account'}
                    </button>
                </div>
            </div>
        </form>
    );
}
