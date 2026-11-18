import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Layers, Box, ShoppingCart, MessageSquare,
    Globe, Settings, LogOut, ArrowLeft, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Categories', path: '/admin/categories', icon: Layers },
        { label: 'Products', path: '/admin/products', icon: Box },
        { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { label: 'Customer Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        { label: 'Website Content', path: '/admin/content', icon: Globe },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
                {/* Brand */}
                <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
                    <img
                        src="/logo.jpeg"
                        alt="Logo"
                        className="w-9 h-9 rounded-lg object-contain bg-white p-0.5"
                    />
                    <div>
                        <div className="font-extrabold text-white text-sm tracking-tight leading-tight">
                            GLOBAL SCIENTIFIC
                        </div>
                        <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                            Admin Control Center
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                    active
                                        ? 'bg-brand-800 text-white shadow-xs'
                                        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer User Info & Exit */}
                <div className="p-4 border-t border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                        <div className="truncate pr-2">
                            <span className="text-white font-bold block truncate">{admin?.full_name || 'Admin'}</span>
                            <span className="text-slate-400 text-[11px] font-mono">@{admin?.username || 'admin'}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    <Link
                        to="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                    >
                        <span>View Public Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
