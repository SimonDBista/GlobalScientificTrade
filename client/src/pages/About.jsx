import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Award, MapPin, Phone, Mail, CheckCircle2,
    Microscope, HardHat, Compass, Baby, ArrowRight, Truck, Wrench
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import useSEO from '../hooks/useSEO';

export default function About() {
    const { settings, categories } = useSettings();

    useSEO({
        title: 'About Us — Trusted Scientific Equipment Supplier Nepal',
        description: 'Learn about Global Scientific Trade Pvt. Ltd. — Nepal\'s trusted supplier of laboratory, civil engineering, math lab, and ECD equipment, with offices in Kathmandu and Dhangadhi.',
        url: '/about',
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Global Scientific Trade',
            url: 'https://globalscientifictrade.com.np/about',
            description: 'Global Scientific Trade Pvt. Ltd. is a leading supplier of scientific laboratory instruments, civil engineering apparatus, math lab kits, and early childhood development materials across Nepal.',
            publisher: {
                '@type': 'Organization',
                name: 'Global Scientific Trade Pvt. Ltd.',
                url: 'https://globalscientifictrade.com.np',
                logo: 'https://globalscientifictrade.com.np/logo.jpeg'
            }
        }
    });

    return (
        <div className="space-y-16 pb-16">
            {/* Header Banner */}
            <div className="bg-brand-950 text-white py-14 border-b border-brand-900">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gold-400">
                        About Global Scientific Trade Pvt. Ltd.
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-2">
                        Trusted Supplier of Scientific & Laboratory Equipment
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
                        Operating from Kathmandu and Dhangadhi, delivering certified precision instruments, turnkey lab setups, and educational equipment nationwide.
                    </p>
                </div>
            </div>

            {/* Corporate Overview */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-5">
                        <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Established Trade & Institutional Supply</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Equipping Nepal's Schools, Colleges, and Engineering Labs
                        </h2>

                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            <strong>Global Scientific Trade Pvt. Ltd.</strong> is a premier supplier of scientific and laboratory equipment operating from Kathmandu and Dhangadhi, Nepal. We specialize in sourcing, supplying, and installing high-precision scientific testing equipment for educational institutions, engineering contractors, quality control laboratories, and healthcare facilities.
                        </p>

                        <p className="text-slate-600 leading-relaxed text-sm">
                            From basic physics apparatus and high-grade borosilicate glassware to computerized 2000KN compression testing machines and Montessori early childhood development kits, we bridge international manufacturing precision with dependable local after-sales service and nationwide crated logistics.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                                <Award className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs">Quality Certified</h4>
                                    <p className="text-[11px] text-slate-500">Every instrument calibrated to relevant national and ASTM/IS test codes.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                                <Truck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs">Direct Logistics</h4>
                                    <p className="text-[11px] text-slate-500">Safe handling and insured freight delivery to all 7 provinces of Nepal.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-brand-900 to-brand-950 text-white rounded-3xl p-8 border border-brand-800 shadow-xl space-y-6">
                        <div className="text-center pb-4 border-b border-brand-800">
                            <img
                                src="/logo.jpeg"
                                alt="Global Scientific Trade"
                                className="w-20 h-20 rounded-2xl object-contain bg-white p-1 mx-auto shadow-md mb-3"
                            />
                            <h3 className="text-lg font-bold">Global Scientific Trade Pvt. Ltd.</h3>
                            <span className="text-xs text-gold-400 font-medium">Kathmandu & Dhangadhi, Nepal</span>
                        </div>

                        <div className="space-y-4 text-xs">
                            {/* KTM Office */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                                    <span className="font-bold text-white">Kathmandu Office (Head Office)</span>
                                </div>
                                <div className="pl-6 text-slate-300 space-y-0.5">
                                    <p>Swayambhu, Kathmandu, Nepal</p>
                                    <div className="flex items-center space-x-1.5 pt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                                        <span className="text-slate-400">Landline:</span>
                                        <a href="tel:+97715924298" className="text-gold-300 font-mono font-bold hover:underline">
                                            +977 1-5924298
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Dhangadhi Office */}
                            <div className="space-y-1 pt-3 border-t border-brand-800/60">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                                    <span className="font-bold text-white">Dhangadhi Office</span>
                                </div>
                                <div className="pl-6 text-slate-300 space-y-0.5">
                                    <p>Dhangadhi, Kailali, Nepal</p>
                                    <div className="flex items-center space-x-1.5 pt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                                        <span className="text-slate-400">Landline:</span>
                                        <a href="tel:+97791591014" className="text-gold-300 font-mono font-bold hover:underline">
                                            +977 91-591014
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                                        <span className="text-slate-400">Mobile:</span>
                                        <a href="tel:+9779847879700" className="text-gold-300 font-mono font-bold hover:underline">
                                            +977 9847879700
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 pt-3 border-t border-brand-800/60">
                                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white block">Institutional Inquiries:</span>
                                    <span className="text-slate-300">gsciencehouse2077@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/contact"
                            className="block text-center py-3 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                        >
                            Contact Our Technical Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Facilities & Strengths */}
            <section className="bg-slate-100 py-16 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Operational Capabilities</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                            Our Key Facilities & Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(settings.facilities && Array.isArray(settings.facilities) ? settings.facilities : [
                            'Complete Laboratory Setup',
                            'Educational & Research Equipment',
                            'Medical & Hospital Instruments',
                            'Engineering & Survey Tools',
                            'Quality Products at Competitive Price',
                            'Institutional & Bulk Supply',
                            'Trusted After-Sales Support',
                            'Safe Nationwide Delivery'
                        ]).map((fac, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                                <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                                    {idx + 1}
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm leading-snug">{fac}</h4>
                                <p className="text-xs text-slate-500">
                                    Full technical verification and warranty assistance directly from our Kathmandu headquarters.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Department Breakdown */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Catalogs in Detail</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                        Four Comprehensive Departments
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                                <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                                    {cat.product_count || 0} Products
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {cat.description}
                            </p>
                            <Link
                                to={`/category/${cat.slug}`}
                                className="inline-flex items-center space-x-1 text-xs font-bold text-brand-700 hover:text-brand-900"
                            >
                                <span>Browse Catalog</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
