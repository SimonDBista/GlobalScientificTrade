import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Headphones, Lock, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
    const { settings, categories } = useSettings();

    return (
        <footer className="bg-brand-950 text-slate-300 pt-16 pb-8 border-t border-brand-900 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* 3 Highlights Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-brand-900">
                    <div className="flex items-center space-x-4 bg-brand-900/40 p-4 rounded-2xl border border-brand-800">
                        <div className="w-12 h-12 rounded-xl bg-brand-800 flex items-center justify-center shrink-0 text-gold-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Certified Lab Quality</h4>
                            <p className="text-xs text-slate-400">Strictly tested scientific and industrial grading</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-brand-900/40 p-4 rounded-2xl border border-brand-800">
                        <div className="w-12 h-12 rounded-xl bg-brand-800 flex items-center justify-center shrink-0 text-gold-400">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Nationwide Dispatch</h4>
                            <p className="text-xs text-slate-400">Reliable crated logistics across all provinces of Nepal</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-brand-900/40 p-4 rounded-2xl border border-brand-800">
                        <div className="w-12 h-12 rounded-xl bg-brand-800 flex items-center justify-center shrink-0 text-gold-400">
                            <Headphones className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Technical After-Sales</h4>
                            <p className="text-xs text-slate-400">Calibration, installation, and spare parts support</p>
                        </div>
                    </div>
                </div>

                {/* Footer Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
                    {/* Col 1: About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.jpeg"
                                alt="Global Scientific Logo"
                                className="w-10 h-10 rounded-lg object-contain bg-white p-0.5"
                            />
                            <div>
                                <span className="font-bold text-white text-base block leading-tight">
                                    GLOBAL SCIENTIFIC
                                </span>
                                <span className="text-[10px] tracking-wider text-gold-400 font-bold uppercase">
                                    TRADE PVT. LTD.
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {settings.company_tagline || 'Trusted Supplier of Scientific, Engineering & Laboratory Equipment'}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Providing turnkey laboratory setups, educational kits, and civil materials testing apparatus from Swayambhu, Kathmandu.
                        </p>
                    </div>

                    {/* Col 2: Core Departments */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-brand-800 pb-2">
                            Product Catalogs
                        </h4>
                        <ul className="space-y-2 text-xs">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/category/${cat.slug}`}
                                        className="hover:text-gold-400 transition-colors flex items-center justify-between"
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">({cat.product_count || 0})</span>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/products" className="text-gold-400 hover:underline font-semibold block pt-1">
                                    View Full Catalog →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Quick Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-brand-800 pb-2">
                            Company & Support
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/" className="hover:text-gold-400 transition-colors">Home Page</Link></li>
                            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Our Company</Link></li>
                            <li><Link to="/products" className="hover:text-gold-400 transition-colors">Product Search & Catalog</Link></li>
                            <li><Link to="/cart" className="hover:text-gold-400 transition-colors">Shopping Cart</Link></li>
                            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Request a Quote / Contact</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Contact Offices */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-brand-800 pb-2">
                            Offices & Inquiries
                        </h4>
                        <div className="space-y-3.5 text-xs">
                            {/* Kathmandu Office */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-1.5 text-white font-semibold">
                                    <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                                    <span>Kathmandu Office (Head Office)</span>
                                </div>
                                <div className="pl-5 text-slate-400 space-y-0.5">
                                    <p>Swayambhu, Kathmandu, Nepal</p>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="w-3 h-3 text-gold-400" />
                                        <a href="tel:+97715924298" className="hover:text-gold-400 text-slate-300 font-mono">
                                            +977 1-5924298
                                        </a>
                                        <span className="text-[10px] text-slate-500">(Landline)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dhangadhi Office */}
                            <div className="space-y-1 pt-2 border-t border-brand-800/60">
                                <div className="flex items-center space-x-1.5 text-white font-semibold">
                                    <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                                    <span>Dhangadhi Office</span>
                                </div>
                                <div className="pl-5 text-slate-400 space-y-0.5">
                                    <p>Dhangadhi, Kailali, Nepal</p>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="w-3 h-3 text-gold-400" />
                                        <a href="tel:+97791591014" className="hover:text-gold-400 text-slate-300 font-mono">
                                            +977 91-591014
                                        </a>
                                        <span className="text-[10px] text-slate-500">(Landline)</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="w-3 h-3 text-gold-400" />
                                        <a href="tel:+9779847879700" className="hover:text-gold-400 text-slate-300 font-mono">
                                            +977 9847879700
                                        </a>
                                        <span className="text-[10px] text-slate-500">(Mobile)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-1 border-t border-brand-800/60">
                                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-white block">Email</span>
                                    <a href="mailto:gsciencehouse2077@gmail.com" className="hover:text-gold-400 text-slate-300 break-all">
                                        {settings.company_email || 'gsciencehouse2077@gmail.com'}
                                    </a>
                                </div>
                            </div>

                            {settings.company_tiktok && (
                                <div className="pt-0.5">
                                    <a
                                        href={settings.company_tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-300"
                                    >
                                        <span>TikTok: @gscientific2077</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-brand-900 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        © {new Date().getFullYear()} Global Scientific Trade Pvt. Ltd. All rights reserved.
                    </div>
                    <div className="text-[11px] text-slate-400">
                        Kathmandu & Dhangadhi, Nepal • Trusted Scientific & Industrial Trade
                    </div>
                </div>
            </div>
        </footer>
    );
}
