import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('AdminPassword2026!');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid username or password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <img
                        src="/logo.jpeg"
                        alt="Global Scientific Trade"
                        className="w-16 h-16 rounded-2xl object-contain mx-auto shadow-sm p-1 border border-slate-100"
                    />
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        GLOBAL SCIENTIFIC TRADE
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Administrative Operations & Content Portal
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Administrator Username
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <span>{submitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <Link to="/" className="hover:text-brand-800 font-medium">
                        ← Return to Website
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">Protected Admin Route</span>
                </div>
            </div>
        </div>
    );
}
