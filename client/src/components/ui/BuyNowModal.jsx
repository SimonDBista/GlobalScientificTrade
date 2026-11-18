import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Shield, Truck, User, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../../api/client';

export default function BuyNowModal({ product, isOpen, onClose }) {
    if (!isOpen || !product) return null;

    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        company_name: '',
        country: 'Nepal',
        city: 'Kathmandu',
        address: '',
        customer_notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const price = product.price ? parseFloat(product.price) : 0;
    const totalAmount = price * quantity;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const orderPayload = {
                ...formData,
                items: [
                    {
                        product_id: product.id,
                        name: product.name,
                        model_number: product.model_number,
                        sku: product.sku,
                        price: product.price,
                        quantity: quantity,
                        price_type: product.price_type
                    }
                ]
            };

            const res = await api.submitOrder(orderPayload);
            onClose();
            // Navigate directly to the Order Confirmation page
            navigate(`/order-confirmation/${res.order.order_number}`);
        } catch (err) {
            setError(err.message || 'Failed to submit order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-brand-900 px-6 py-4 flex items-center justify-between text-white">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-gold-400">Express Order</span>
                        <h3 className="text-lg font-bold">Buy Now: {product.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Item and Quantity Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-slate-800">{product.name}</div>
                            {product.model_number && (
                                <div className="text-xs font-mono text-slate-500">Model: {product.model_number}</div>
                            )}
                            <div className="text-sm font-bold text-brand-700 mt-1">
                                {price > 0 ? `NPR ${price.toLocaleString()}` : 'Quote on Request'}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold"
                            >
                                -
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {price > 0 && (
                        <div className="flex justify-between items-center px-1 text-sm font-semibold text-slate-700">
                            <span>Estimated Total:</span>
                            <span className="text-base font-extrabold text-brand-900">
                                NPR {totalAmount.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Your Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Anil Shrestha"
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
                                    placeholder="e.g. 9841000000"
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
                                    placeholder="name@example.com"
                                    value={formData.customer_email}
                                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                    className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Delivery City <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Kathmandu / Pokhara / etc."
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Delivery Address / Street <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Campus address, street, ward number"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-amber-900">
                        <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">No Online Card Required:</span> Our logistics team will verify this purchase order by phone and dispatch with official receipt.
                        </div>
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
                            className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                        >
                            {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
