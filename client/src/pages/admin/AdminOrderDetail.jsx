import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Printer, CheckCircle2, Clock, AlertCircle, Save,
    User, Phone, Mail, MapPin, Building2, ShieldCheck, History, Trash2
} from 'lucide-react';
import { api } from '../../api/client';

export default function AdminOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [internalNotes, setInternalNotes] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);
    const [notesSavedMsg, setNotesSavedMsg] = useState(false);

    const loadOrder = () => {
        setLoading(true);
        api.getOrder(id)
            .then(res => {
                setOrderData(res);
                setNewStatus(res.order.status);
                setInternalNotes(res.order.internal_notes || '');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setUpdatingStatus(true);
        try {
            await api.updateOrderStatus(orderData.order.id, newStatus, statusNotes);
            setStatusNotes('');
            loadOrder();
        } catch (err) {
            alert(err.message || 'Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSaveInternalNotes = async () => {
        setSavingNotes(true);
        try {
            await api.updateOrderNotes(orderData.order.id, internalNotes);
            setNotesSavedMsg(true);
            setTimeout(() => setNotesSavedMsg(false), 2500);
        } catch (err) {
            alert(err.message || 'Failed to save notes');
        } finally {
            setSavingNotes(false);
        }
    };

    const handleDeleteOrder = async () => {
        if (!window.confirm(`Are you sure you want to permanently delete order #${orderData.order.order_number}? All associated line items and status records will be deleted. This cannot be undone.`)) {
            return;
        }
        setDeleting(true);
        try {
            await api.deleteOrder(orderData.order.id);
            navigate('/admin/orders');
        } catch (err) {
            alert(err.message || 'Failed to delete order.');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-medium">Loading order details...</p>
            </div>
        );
    }

    if (!orderData || !orderData.order) {
        return (
            <div className="py-20 text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
                <Link to="/admin/orders" className="text-xs font-bold text-brand-800 hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const { order, items = [], history = [] } = orderData;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-16">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                    <Link
                        to="/admin/orders"
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-white transition-colors border border-slate-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                                {order.order_number}
                            </h1>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-900 border border-brand-200">
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print Order Slip</span>
                    </button>
                    <button
                        onClick={handleDeleteOrder}
                        disabled={deleting}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                        title="Delete this order permanently"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{deleting ? 'Deleting...' : 'Delete Order'}</span>
                    </button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Order Items and History */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Customer Information Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                            <User className="w-4 h-4 text-brand-700" />
                            <span>Customer & Institutional Details</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="font-bold text-slate-400 block uppercase text-[10px]">Contact Person</span>
                                <div className="font-extrabold text-slate-900 text-sm">{order.customer_name}</div>
                                {order.company_name && (
                                    <div className="text-brand-800 font-semibold mt-0.5">{order.company_name}</div>
                                )}
                            </div>

                            <div>
                                <span className="font-bold text-slate-400 block uppercase text-[10px]">Contact Coordinates</span>
                                <div className="text-slate-800 font-medium">Tel: <strong className="font-mono">{order.customer_phone}</strong></div>
                                <div className="text-slate-600">Email: {order.customer_email}</div>
                            </div>

                            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-400 block uppercase text-[10px]">Destination Address</span>
                                <div className="text-slate-800 font-medium">
                                    {order.address}, {order.city}, {order.country}
                                </div>
                            </div>

                            {order.customer_notes && (
                                <div className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <span className="font-bold text-slate-600 block text-[11px] mb-0.5">Customer Message / Requirements:</span>
                                    <p className="text-slate-700 italic">{order.customer_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                            Ordered Equipment & Instruments ({items.length})
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="py-2.5 px-3">Item</th>
                                        <th className="py-2.5 px-3 font-mono">Model</th>
                                        <th className="py-2.5 px-3 text-center">Qty</th>
                                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((it, idx) => (
                                        <tr key={it.id || idx}>
                                            <td className="py-2.5 px-3 font-bold text-slate-900">{it.product_name}</td>
                                            <td className="py-2.5 px-3 font-mono text-slate-500">{it.model_number || '-'}</td>
                                            <td className="py-2.5 px-3 text-center font-bold">{it.quantity}</td>
                                            <td className="py-2.5 px-3 text-right text-slate-700">
                                                {it.unit_price ? `NPR ${it.unit_price.toLocaleString()}` : 'Quote'}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                                                {it.total_price ? `NPR ${it.total_price.toLocaleString()}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 font-bold">
                                    <tr>
                                        <td colSpan={4} className="py-2.5 px-3 text-right">Fixed Items Total:</td>
                                        <td className="py-2.5 px-3 text-right text-brand-900 font-extrabold">
                                            NPR {(order.subtotal || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Status History & Audit Trail */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                            <History className="w-4 h-4 text-brand-700" />
                            <span>Workflow & Status Audit Trail</span>
                        </h3>

                        <div className="space-y-3">
                            {history.map((h, idx) => (
                                <div key={idx} className="flex items-start space-x-3 text-xs border-l-2 border-brand-600 pl-3 py-1">
                                    <div>
                                        <div className="font-bold text-slate-800">
                                            {h.new_status}
                                            <span className="text-[11px] font-normal text-slate-500 ml-2">by {h.changed_by}</span>
                                        </div>
                                        {h.notes && (
                                            <p className="text-slate-600 mt-0.5">{h.notes}</p>
                                        )}
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            {new Date(h.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Status Management & Internal Notes */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Status Change Form */}
                    <form onSubmit={handleUpdateStatus} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                            Update Order Status
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Next Status:
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold focus:outline-hidden"
                            >
                                <option value="New Order">New Order</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Quotation Sent">Quotation Sent</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Status Change Note (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Phone confirmed with lab manager..."
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-hidden"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={updatingStatus || newStatus === order.status}
                            className="w-full py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50"
                        >
                            {updatingStatus ? 'Updating...' : 'Save New Status'}
                        </button>
                    </form>

                    {/* Internal Admin Notes */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                            Internal Office Notes
                        </h3>

                        <textarea
                            rows={4}
                            placeholder="Add confidential notes for staff (e.g. dispatch truck number, special discounts, calibration details)..."
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-hidden resize-none leading-relaxed"
                        />

                        {notesSavedMsg && (
                            <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center space-x-1.5 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Notes saved successfully.</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSaveInternalNotes}
                            disabled={savingNotes}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                        >
                            {savingNotes ? 'Saving...' : 'Save Internal Notes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
