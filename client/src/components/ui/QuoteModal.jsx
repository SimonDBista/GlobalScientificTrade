import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Building2, Phone, Mail, User } from 'lucide-react';
import { api } from '../../api/client';

export default function QuoteModal({ product, isOpen, onClose }) {
    if (!isOpen || !product) return null;

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        company_name: '',
        quantity: 1,
        message: `Please send me an official quotation for ${product.name}${product.model_number ? ` (Model: ${product.model_number})` : ''} including delivery to our location and applicable technical specifications.`
    });

    const [submitting, setSubmitting] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const payload = {
                product_id: product.id,
                product_name: product.name,
                product_model: product.model_number,
                ...formData
            };
            const res = await api.submitInquiry(payload);
            setSuccessData(res.inquiry);
        } catch (err) {
            setError(err.message || 'Failed to submit quote inquiry. Please try again or call us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                {/* Modal Header */}
                <div className="bg-brand-900 px-6 py-4 flex items-center justify-between text-white">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-gold-400">Institutional Supply</span>
                        <h3 className="text-lg font-bold">Request Official Quotation</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {successData ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Quotation Request Received!</h4>
                        <p className="text-sm text-slate-600">
                            Thank you, <span className="font-semibold text-slate-800">{successData.customer_name}</span>. Your inquiry reference number is:
                        </p>
                        <div className="inline-block bg-slate-100 text-brand-900 font-mono font-bold text-base px-4 py-2 rounded-lg border border-slate-200">
                            {successData.inquiry_number}
                        </div>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Our institutional sales team will review your specifications and send a formal proforma quote to <span className="font-medium text-slate-700">{successData.customer_email}</span> shortly.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Target Product Badge */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3">
                            <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">Selected Product</span>
                                <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                                {product.model_number && (
                                    <span className="text-xs text-slate-500 font-mono">Model: {product.model_number}</span>
                                )}
                            </div>
                            <div className="w-24">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Required Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full text-center text-sm font-bold py-1 px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Dr. Ramesh Sharma"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="e.g. 9841234567"
                                        value={formData.customer_phone}
                                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                        className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@organization.com"
                                        value={formData.customer_email}
                                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                        className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Company / Institution (Optional)
                                </label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="e.g. ABC College / Lab"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Specific Requirements / Destination Location <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none"
                            />
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{submitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
