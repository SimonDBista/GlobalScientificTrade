import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShieldCheck, Truck, ArrowLeft, Send, AlertCircle, Building2,
    Phone, Mail, User, MapPin, FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

export default function Checkout() {
    const { cart, subtotal, hasQuoteItems, clearCart } = useCart();
    const navigate = useNavigate();

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

    if (cart.length === 0) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">No items to checkout</h2>
                <p className="text-xs text-slate-500">Your cart is currently empty. Please add items before checking out.</p>
                <Link to="/products" className="inline-block px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-semibold">
                    Browse Products
                </Link>
            </div>
        );
    }

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const orderPayload = {
                ...formData,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    name: item.name,
                    model_number: item.model_number,
                    sku: item.sku,
                    price: item.price,
                    quantity: item.quantity,
                    price_type: item.price_type
                }))
            };

            const res = await api.submitOrder(orderPayload);
            clearCart();
            navigate(`/order-confirmation/${res.order.order_number}`);
        } catch (err) {
            setError(err.message || 'Failed to submit order. Please verify your details and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
            <Link
                to="/cart"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Shopping Cart</span>
            </Link>

            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Order Submission & Procurement Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide your institutional delivery and contact details. No online credit card payment is required.
                </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Customer Info Form */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
                        <User className="w-4 h-4 text-brand-700" />
                        <span>1. Customer & Institutional Information</span>
                    </h3>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Prof. Suresh Adhikari"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="e.g. 9841234567"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@institution.edu.np"
                                value={formData.customer_email}
                                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Institution / Organization / Company (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Tribhuvan University, Civil Dept."
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-3 pb-3 border-b border-slate-100 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-brand-700" />
                        <span>2. Delivery Address (Nepal)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                City / District <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Kathmandu / Pokhara / Biratnagar"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                disabled
                                value={formData.country}
                                className="w-full text-xs p-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-600 font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Specific Street Address / Campus / Ward <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Campus block, laboratory room number, street name"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Special Instructions / Calibration Notes
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Specify if you require calibration certificates, institutional PAN/VAT billing, or scheduled installation assistance..."
                            value={formData.customer_notes}
                            onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none"
                        />
                    </div>
                </div>

                {/* Right: Order Summary & Placement */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
                        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                            Order Items Summary ({cart.length})
                        </h3>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                                    <div className="pr-2">
                                        <span className="font-bold text-slate-800 block">{item.name}</span>
                                        {item.model_number && (
                                            <span className="text-[11px] text-slate-500 font-mono">Mod: {item.model_number}</span>
                                        )}
                                        <span className="text-slate-500 block">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {item.price ? (
                                            <span className="font-extrabold text-slate-900">
                                                NPR {(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-amber-700">Quote Item</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Fixed Items Subtotal:</span>
                                <span className="font-bold text-slate-900">NPR {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Estimated Logistics:</span>
                                <span className="font-medium text-emerald-700">Calculated on verification</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-extrabold text-brand-950">
                                <span>Total Payable (on delivery):</span>
                                <span className="text-lg text-brand-900">NPR {subtotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment requirement notice */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                                <ShieldCheck className="w-4 h-4 text-brand-700" />
                                <span>Institutional Purchase Model</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Upon clicking "Place Order", your request will be logged in our central administrative system. Our technical team in Kathmandu (+977 1-5924298) and Dhangadhi (+977 91-591014 / +977 9847879700) will verify product availability, calibration certificates, and coordinate dispatch.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            <span>{submitting ? 'Submitting Order...' : 'Submit Institutional Order'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
