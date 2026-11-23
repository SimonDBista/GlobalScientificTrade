import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    ShoppingCart, Search, Filter, Eye, ArrowRight, CheckCircle2,
    Clock, AlertCircle, Phone, Mail, MapPin, Printer, Trash2
} from 'lucide-react';
import { api } from '../../api/client';

export default function AdminOrders() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const statusFilter = searchParams.get('status') || '';
    const searchQuery = searchParams.get('search') || '';

    const loadOrders = () => {
        setLoading(true);
        api.getOrders({
            status: statusFilter,
            search: searchQuery,
            limit: 100
        })
            .then(res => {
                setOrders(res.orders || []);
                setTotal(res.total || 0);
            })
            .catch(err => console.error('Failed to load orders', err))
            .finally(() => setLoading(false));
    };

    const handleDeleteOrder = async (order) => {
        if (!window.confirm(`Are you sure you want to permanently delete order #${order.order_number} (${order.customer_name})? This action cannot be undone.`)) {
            return;
        }
        try {
            await api.deleteOrder(order.id);
            loadOrders();
        } catch (err) {
            alert(err.message || 'Failed to delete order.');
        }
    };

    useEffect(() => {
        loadOrders();
    }, [statusFilter, searchQuery]);

    const updateStatusFilter = (val) => {
        const next = new URLSearchParams(searchParams);
        if (val) next.set('status', val);
        else next.delete('status');
        setSearchParams(next);
    };

    const statusBadges = {
        'New Order': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
        'Contacted': 'bg-blue-100 text-blue-800 border-blue-200',
        'Quotation Sent': 'bg-purple-100 text-purple-800 border-purple-200',
        'Confirmed': 'bg-teal-100 text-teal-800 border-teal-200',
        'Processing': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Completed': 'bg-slate-100 text-slate-800 border-slate-300',
        'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Order & Purchase Submissions
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                    Track client orders, update verification workflows, and view itemized slips.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by order #, customer name, phone, or campus..."
                        value={searchQuery}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set('search', e.target.value);
                            else next.delete('search');
                            setSearchParams(next);
                        }}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => updateStatusFilter(e.target.value)}
                        className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:outline-hidden"
                    >
                        <option value="">All Statuses ({total})</option>
                        <option value="New Order">New Order</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        Total: <span className="font-bold text-slate-900">{orders.length}</span>
                    </span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Order #</th>
                                <th className="py-3 px-4">Date & Time</th>
                                <th className="py-3 px-4">Customer Details</th>
                                <th className="py-3 px-4">Delivery City</th>
                                <th className="py-3 px-4 text-center">Items</th>
                                <th className="py-3 px-4">Fixed Total</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50/80">
                                    <td className="py-3 px-4 font-mono font-bold text-brand-900">
                                        {o.order_number}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                                        {new Date(o.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-900">{o.customer_name}</div>
                                        {o.company_name && (
                                            <div className="text-[11px] text-slate-600 font-semibold">{o.company_name}</div>
                                        )}
                                        <div className="text-[11px] text-slate-400">{o.customer_phone}</div>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-slate-700">
                                        {o.city}
                                    </td>
                                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                                        {o.item_count || 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        {o.subtotal > 0 ? (
                                            <span className="font-extrabold text-slate-900">
                                                NPR {o.subtotal.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-amber-700">
                                                Quote
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadges[o.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end space-x-1.5">
                                            <Link
                                                to={`/admin/orders/${o.id}`}
                                                className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-lg text-xs transition-colors inline-flex items-center space-x-1"
                                                title="View & manage order"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Manage</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteOrder(o)}
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Order"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && !loading && (
                    <div className="p-12 text-center text-xs text-slate-500">
                        No orders found matching the filter criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
