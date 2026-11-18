import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Printer, ArrowRight, Phone, Mail, MapPin, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';

export default function OrderConfirmation() {
    const { orderNumber } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Trigger celebratory confetti
        try {
            confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch {}

        api.getOrder(orderNumber)
            .then(res => setOrderData(res))
            .catch(err => console.error('Failed to load order confirmation', err))
            .finally(() => setLoading(false));
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Generating your order confirmation receipt...</p>
            </div>
        );
    }

    if (!orderData || !orderData.order) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Order Information Unavailable</h2>
                <p className="text-slate-500 text-xs">Reference number {orderNumber} could not be retrieved.</p>
                <Link to="/products" className="inline-block px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-semibold">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const { order, items = [] } = orderData;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
            {/* Top Success Banner (no-print) */}
            <div className="no-print bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    Order Submitted Successfully!
                </h1>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto">
                    Thank you, <span className="font-bold">{order.customer_name}</span>. Your institutional order has been registered in our central system and assigned for immediate processing.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-2"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print Order Slip</span>
                    </button>
                    <Link
                        to="/products"
                        className="px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-2"
                    >
                        <span>Continue Browsing</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Printable Order Slip / Official Proforma Slip */}
            <div className="print-area bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-8">
                {/* Header with Company Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.jpeg"
                            alt="Global Scientific Trade"
                            className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200 p-1"
                        />
                        <div>
                            <h2 className="text-lg font-black text-brand-950 leading-tight">
                                GLOBAL SCIENTIFIC TRADE PVT. LTD.
                            </h2>
                            <p className="text-xs text-slate-500">
                                KTM Landline: +977 1-5924298 • Dhangadhi: +977 91-591014 / +977 9847879700
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Email: gsciencehouse2077@gmail.com
                            </p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                            Order Reference ID
                        </span>
                        <span className="text-xl font-mono font-black text-brand-900">
                            {order.order_number}
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                            Date: {new Date(order.created_at).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Customer Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Customer / Bill To:
                        </span>
                        <div className="text-slate-900 font-bold text-sm">{order.customer_name}</div>
                        {order.company_name && (
                            <div className="text-slate-700 font-semibold">{order.company_name}</div>
                        )}
                        <div className="text-slate-600 mt-1">Phone: {order.customer_phone}</div>
                        <div className="text-slate-600">Email: {order.customer_email}</div>
                    </div>

                    <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Destination Delivery Address:
                        </span>
                        <div className="text-slate-800 font-medium leading-relaxed">
                            {order.address}, {order.city}, {order.country}
                        </div>
                        <div className="mt-2 text-[11px]">
                            <span className="font-bold text-slate-600">Status: </span>
                            <span className="inline-block px-2 py-0.5 rounded font-bold bg-brand-100 text-brand-900 border border-brand-200">
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items Table */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Ordered Equipment & Instruments
                    </h3>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">#</th>
                                    <th className="py-3 px-4">Product Name & Specifications</th>
                                    <th className="py-3 px-4">Model / SKU</th>
                                    <th className="py-3 px-4 text-center">Qty</th>
                                    <th className="py-3 px-4 text-right">Unit Price</th>
                                    <th className="py-3 px-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((it, idx) => (
                                    <tr key={it.id || idx}>
                                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                                        <td className="py-3 px-4 font-bold text-slate-900">{it.product_name}</td>
                                        <td className="py-3 px-4 font-mono text-slate-500">{it.model_number || it.sku || '-'}</td>
                                        <td className="py-3 px-4 text-center font-bold text-slate-800">{it.quantity}</td>
                                        <td className="py-3 px-4 text-right text-slate-700">
                                            {it.unit_price ? `NPR ${it.unit_price.toLocaleString()}` : 'Quote on Request'}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                                            {it.total_price ? `NPR ${it.total_price.toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                                <tr>
                                    <td colSpan={5} className="py-3 px-4 text-right text-slate-700">
                                        Fixed Items Total:
                                    </td>
                                    <td className="py-3 px-4 text-right text-brand-950 font-extrabold text-sm">
                                        NPR {(order.subtotal || 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {order.customer_notes && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 block mb-1">Customer Instructions:</span>
                        <p className="text-slate-600">{order.customer_notes}</p>
                    </div>
                )}

                {/* Important Next Steps */}
                <div className="border-t border-slate-200 pt-6 text-xs text-slate-600 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        What Happens Next?
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                        <li>Our warehouse and technical dispatch team will verify stock and prepare calibration documents.</li>
                        <li>An institutional representative will call <strong className="text-slate-800">{order.customer_phone}</strong> to confirm invoice details and logistics time.</li>
                        <li>Delivery will be dispatched safely to your designated address in {order.city}.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
