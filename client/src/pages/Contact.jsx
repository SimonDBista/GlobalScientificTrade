import React, { useState } from 'react';
import {
    MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle,
    Building2, MessageSquare, ExternalLink, ShieldCheck
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../api/client';
import useSEO from '../hooks/useSEO';

export default function Contact() {
    const { settings } = useSettings();

    useSEO({
        title: 'Contact Us — Global Scientific Trade Nepal',
        description: 'Contact Global Scientific Trade Pvt. Ltd. for scientific equipment inquiries. Reach our Kathmandu office at +977-1-5924298 or Dhangadhi at +977-91-591014.',
        url: '/contact',
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Global Scientific Trade',
            url: 'https://globalscientifictrade.com.np/contact',
            description: 'Contact Global Scientific Trade for scientific laboratory equipment, engineering apparatus, and educational materials inquiries in Nepal.'
        }
    });

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        company_name: '',
        product_name: 'General Lab Equipment Inquiry',
        quantity: 1,
        message: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await api.submitInquiry(formData);
            setSuccess(res.inquiry);
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                company_name: '',
                product_name: 'General Lab Equipment Inquiry',
                quantity: 1,
                message: ''
            });
        } catch (err) {
            setError(err.message || 'Failed to submit inquiry. Please call us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 pb-16">
            {/* Header Banner */}
            <div className="bg-brand-950 text-white py-14 border-b border-brand-900">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gold-400">
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
                        Contact Global Scientific Trade
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
                        Speak directly with our technical teams in Kathmandu (+977 1-5924298) and Dhangadhi (+977 91-591014 / +977 9847879700) for institutional quotes, tenders, and lab setups.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Contact Info & Offices */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                                Corporate Offices & Showrooms
                            </h3>

                            <div className="space-y-6 text-xs">
                                {/* Kathmandu Office */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                    <div className="flex items-center space-x-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-slate-900 text-sm block">Kathmandu Office (Head Office)</span>
                                            <span className="text-[11px] text-slate-500">Central Hub & Showroom</span>
                                        </div>
                                    </div>
                                    <div className="pl-1 space-y-1 text-slate-600">
                                        <p className="font-medium text-slate-800">Swayambhu, Kathmandu, Nepal</p>
                                        <div className="flex items-center space-x-2 pt-1">
                                            <Phone className="w-3.5 h-3.5 text-brand-700" />
                                            <span className="text-slate-500 font-semibold">Landline:</span>
                                            <a href="tel:+97715924298" className="text-brand-800 font-bold hover:underline font-mono text-xs">
                                                +977 1-5924298
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Dhangadhi Office */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                    <div className="flex items-center space-x-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gold-600 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-slate-900 text-sm block">Dhangadhi Office</span>
                                            <span className="text-[11px] text-slate-500">Sudurpashchim Regional Office</span>
                                        </div>
                                    </div>
                                    <div className="pl-1 space-y-1.5 text-slate-600">
                                        <p className="font-medium text-slate-800">Dhangadhi, Kailali, Nepal</p>
                                        <div className="flex items-center space-x-2 pt-0.5">
                                            <Phone className="w-3.5 h-3.5 text-gold-700" />
                                            <span className="text-slate-500 font-semibold">Landline:</span>
                                            <a href="tel:+97791591014" className="text-brand-800 font-bold hover:underline font-mono text-xs">
                                                +977 91-591014
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-3.5 h-3.5 text-gold-700" />
                                            <span className="text-slate-500 font-semibold">Mobile:</span>
                                            <a href="tel:+9779847879700" className="text-brand-800 font-bold hover:underline font-mono text-xs">
                                                +977 9847879700
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Email & Social */}
                                <div className="flex items-start space-x-3.5 pt-1">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block text-sm">Official Email</span>
                                        <a href="mailto:gsciencehouse2077@gmail.com" className="text-brand-700 hover:underline block mt-0.5 break-all">
                                            {settings.company_email || 'gsciencehouse2077@gmail.com'}
                                        </a>
                                        <span className="text-[11px] text-slate-400">Institutional tenders, RFQs, and quotes</span>
                                    </div>
                                </div>

                                {settings.company_tiktok && (
                                    <div className="flex items-start space-x-3.5 pt-2 border-t border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 block text-sm">Social Media</span>
                                            <a
                                                href={settings.company_tiktok}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand-700 hover:underline block mt-0.5"
                                            >
                                                tiktok.com/@gscientific2077
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
                                <div className="flex items-center space-x-2 font-bold text-slate-800">
                                    <Clock className="w-4 h-4 text-brand-700" />
                                    <span>Business & Dispatch Hours</span>
                                </div>
                                <p className="text-[11px]">Sunday – Friday: 9:00 AM – 6:00 PM</p>
                                <p className="text-[11px]">Saturday: Closed (Emergency inquiries via phone)</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Message & RFQ Submission Form */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Send a Direct Message or Tender Request
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Fill in the details below to receive a formal proforma quote or lab consultation.
                            </p>
                        </div>

                        {success && (
                            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 space-y-2">
                                <div className="flex items-center space-x-2 font-bold text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span>Thank you! Your message has been sent.</span>
                                </div>
                                <p className="text-xs text-emerald-700">
                                    Reference ID: <strong className="font-mono">{success.inquiry_number}</strong>. Our technical team will get back to you shortly.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Your Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Dr. / Er. / Mr. / Ms."
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
                                        placeholder="name@school-or-lab.com"
                                        value={formData.customer_email}
                                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Institution / School / Organization
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. National Model College"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Equipment / Department of Interest
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Concrete Testing Lab, Science Glassware, Montessori Toys..."
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Your Message & Specific Requirements <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Please describe your requirements, needed quantities, destination city, or tender deadline..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{submitting ? 'Submitting...' : 'Submit Inquiry / Request Quote'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
