import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Box, Layers, ShoppingCart, MessageSquare,
    Clock, CheckCircle2, ArrowRight, PlusCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import { api } from '../../api/client';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboardStats()
            .then(res => setStats(res))
            .catch(err => console.error('Failed to load dashboard stats', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-medium">Loading operational metrics...</p>
            </div>
        );
    }

    const { stats: s = {}, recentOrders = [], recentInquiries = [], ordersByStatus = [] } = stats || {};

    const statCards = [
        { label: 'Total Products', val: s.totalProducts || 0, icon: Box, color: 'text-brand-700 bg-brand-50 border-brand-200' },
        { label: 'Active Categories', val: s.totalCategories || 0, icon: Layers, color: 'text-blue-700 bg-blue-50 border-blue-200' },
        { label: 'New Orders', val: s.newOrders || 0, icon: ShoppingCart, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        { label: 'Pending / Review', val: s.pendingOrders || 0, icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
        { label: 'Customer Inquiries', val: s.totalInquiries || 0, icon: MessageSquare, color: 'text-purple-700 bg-purple-50 border-purple-200' },
        { label: 'Completed Orders', val: s.completedOrders || 0, icon: CheckCircle2, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Administrative Overview
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Global Scientific Trade Pvt. Ltd. Management System
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        to="/admin/products/new"
                        className="px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
                    >
                        <Layers className="w-4 h-4" />
                        <span>Manage Categories</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((c, idx) => {
                    const Icon = c.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                                    {c.label}
                                </span>
                                <div className={`p-1.5 rounded-lg border ${c.color}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 font-mono">
                                {c.val}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders & Inquiries Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Recent Orders Table */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4 text-brand-700" />
                            <h3 className="font-bold text-slate-900 text-sm">Recent Incoming Orders</h3>
                        </div>
                        <Link to="/admin/orders" className="text-xs font-bold text-brand-700 hover:underline">
                            View All Orders →
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2">
                                        <th className="pb-2">Order #</th>
                                        <th className="pb-2">Customer</th>
                                        <th className="pb-2">Status</th>
                                        <th className="pb-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map(o => (
                                        <tr key={o.id} className="hover:bg-slate-50">
                                            <td className="py-2.5 font-mono font-bold text-brand-900">
                                                {o.order_number}
                                            </td>
                                            <td className="py-2.5">
                                                <div className="font-bold text-slate-800">{o.customer_name}</div>
                                                <div className="text-[11px] text-slate-400">{o.customer_email}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    o.status === 'New Order' ? 'bg-emerald-100 text-emerald-800' :
                                                    o.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    o.status === 'Completed' ? 'bg-slate-100 text-slate-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-right">
                                                <Link
                                                    to={`/admin/orders/${o.id}`}
                                                    className="text-xs font-bold text-brand-700 hover:text-brand-900"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 py-4 text-center">No orders recorded yet.</p>
                    )}
                </div>

                {/* Recent Inquiries / Quote Requests */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-purple-700" />
                            <h3 className="font-bold text-slate-900 text-sm">Quote Requests & Inquiries</h3>
                        </div>
                        <Link to="/admin/inquiries" className="text-xs font-bold text-brand-700 hover:underline">
                            View All →
                        </Link>
                    </div>

                    {recentInquiries.length > 0 ? (
                        <div className="space-y-3">
                            {recentInquiries.map(inq => (
                                <div key={inq.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-[11px] font-bold text-purple-900">
                                            {inq.inquiry_number}
                                        </span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                            inq.status === 'New' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {inq.status}
                                        </span>
                                    </div>
                                    <div className="font-bold text-slate-900">{inq.customer_name}</div>
                                    <div className="text-slate-600 truncate">{inq.product_name || 'General Inquiry'}</div>
                                    <div className="text-[11px] text-slate-400">Tel: {inq.customer_phone}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 py-4 text-center">No inquiries received yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
