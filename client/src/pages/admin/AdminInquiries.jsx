import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Search, Filter, Eye, CheckCircle2, AlertCircle,
    User, Phone, Mail, Building2, Calendar, X, Save
} from 'lucide-react';
import { api } from '../../api/client';

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for viewing & editing single inquiry
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [internalNotes, setInternalNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const loadInquiries = () => {
        setLoading(true);
        api.getInquiries({
            status: statusFilter,
            search: searchQuery,
            limit: 100
        })
        .then(res => {
            setInquiries(res.inquiries || []);
            setTotal(res.total || 0);
        })
        .catch(err => console.error('Failed to load inquiries', err))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadInquiries();
    }, [statusFilter, searchQuery]);

    const handleOpenDetail = (inq) => {
        setSelectedInquiry(inq);
        setNewStatus(inq.status);
        setInternalNotes(inq.internal_notes || '');
    };

    const handleUpdateInquiry = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.updateInquiry(selectedInquiry.id, {
                status: newStatus,
                internal_notes: internalNotes
            });
            setSelectedInquiry(null);
            loadInquiries();
        } catch (err) {
            alert(err.message || 'Failed to update inquiry');
        } finally {
            setSaving(false);
        }
    };

    const statusPills = {
        'New': 'bg-purple-100 text-purple-800 border-purple-200',
        'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
        'Quotation Sent': 'bg-blue-100 text-blue-800 border-blue-200',
        'Contacted': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Closed': 'bg-slate-100 text-slate-700 border-slate-200'
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Customer Inquiries & Quote Requests
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                    Review proforma quote requests submitted for lab equipment and educational materials.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by inquiry #, customer, phone, or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:outline-hidden"
                    >
                        <option value="">All Statuses ({total})</option>
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        Total: <span className="font-bold text-slate-900">{inquiries.length}</span>
                    </span>
                </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Inquiry #</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Customer Details</th>
                                <th className="py-3 px-4">Requested Apparatus</th>
                                <th className="py-3 px-4 text-center">Qty</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inquiries.map((inq) => (
                                <tr key={inq.id} className="hover:bg-slate-50/80">
                                    <td className="py-3 px-4 font-mono font-bold text-purple-900">
                                        {inq.inquiry_number}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                                        {new Date(inq.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-900">{inq.customer_name}</div>
                                        {inq.company_name && (
                                            <div className="text-[11px] text-slate-600 font-semibold">{inq.company_name}</div>
                                        )}
                                        <div className="text-[11px] text-slate-400">{inq.customer_phone}</div>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                                        {inq.product_name || 'General Inquiry'}
                                        {inq.product_model && (
                                            <span className="text-[11px] font-mono text-slate-400 block">Mod: {inq.product_model}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                                        {inq.quantity}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusPills[inq.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {inq.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleOpenDetail(inq)}
                                            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-lg text-xs transition-colors"
                                        >
                                            View & Respond
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {inquiries.length === 0 && !loading && (
                    <div className="p-12 text-center text-xs text-slate-500">
                        No inquiries or quote requests found.
                    </div>
                )}
            </div>

            {/* Inquiry Detail Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Inquiry Record</span>
                                <h3 className="text-base font-bold text-slate-900 font-mono">
                                    {selectedInquiry.inquiry_number}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Customer:</span>
                                <span className="font-bold text-slate-900">{selectedInquiry.customer_name}</span>
                            </div>
                            {selectedInquiry.company_name && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Organization:</span>
                                    <span className="font-semibold text-slate-800">{selectedInquiry.company_name}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-400">Phone:</span>
                                <a href={`tel:${selectedInquiry.customer_phone}`} className="font-mono font-bold text-brand-800 hover:underline">
                                    {selectedInquiry.customer_phone}
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Email:</span>
                                <a href={`mailto:${selectedInquiry.customer_email}`} className="font-medium text-brand-800 hover:underline">
                                    {selectedInquiry.customer_email}
                                </a>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-200">
                                <span className="text-slate-400">Requested Item:</span>
                                <span className="font-bold text-slate-900">{selectedInquiry.product_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Requested Quantity:</span>
                                <span className="font-bold text-slate-900">{selectedInquiry.quantity} unit(s)</span>
                            </div>
                        </div>

                        {/* Customer Requirements Message */}
                        <div>
                            <span className="block text-xs font-bold text-slate-700 mb-1">
                                Customer's Detailed Requirements / Message:
                            </span>
                            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/60 text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
                                {selectedInquiry.message}
                            </div>
                        </div>

                        {/* Status & Internal Notes Form */}
                        <form onSubmit={handleUpdateInquiry} className="space-y-3 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Update Inquiry Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold focus:outline-hidden"
                                >
                                    <option value="New">New</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Quotation Sent">Quotation Sent</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Internal Staff Notes
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Sent proforma invoice #402 by email..."
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-xl focus:outline-hidden resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedInquiry(null)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Updates'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
