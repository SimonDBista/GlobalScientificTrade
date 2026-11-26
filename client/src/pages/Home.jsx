import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, CheckCircle2, Shield, Microscope, HardHat, Compass, Baby,
    Search, Award, Sparkles, Building, PhoneCall, Truck, Wrench
} from 'lucide-react';
import { api } from '../api/client';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ui/ProductCard';
import useSEO from '../hooks/useSEO';

export default function Home() {
    const { settings, categories } = useSettings();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useSEO({
        title: 'Science Lab, Civil Engineering, Math Lab & Montessori Materials Nepal',
        description: 'Global Scientific Trade Pvt. Ltd. — Supplier of science lab products, civil engineering equipment, math lab and learning tools, and Montessori kids materials in Kathmandu & Dhangadhi, Nepal.',
        keywords: 'science lab product, civil engineering equipment, math lab and learning tools, montessori kids material, dhangadhi, kathmandu, nepal, laboratory apparatus, science equipment nepal',
        url: '/',
        jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'LocalBusiness',
                    '@id': 'https://globalscientifictrade.com.np/#organization',
                    name: 'Global Scientific Trade Pvt. Ltd.',
                    alternateName: ['Global Scientific Trade', 'GST Nepal'],
                    description: 'Supplier of science lab products, civil engineering equipment, math lab and learning tools, and Montessori kids materials in Kathmandu and Dhangadhi, Nepal.',
                    url: 'https://globalscientifictrade.com.np',
                    logo: 'https://globalscientifictrade.com.np/logo.jpeg',
                    image: 'https://globalscientifictrade.com.np/logo.jpeg',
                    telephone: ['+977-1-5924298', '+977-91-591014', '+977-9847879700'],
                    email: 'gsciencehouse2077@gmail.com',
                    priceRange: '$$',
                    address: [
                        {
                            '@type': 'PostalAddress',
                            streetAddress: 'Swayambhu',
                            addressLocality: 'Kathmandu',
                            addressRegion: 'Bagmati Province',
                            postalCode: '44600',
                            addressCountry: 'NP',
                            description: 'Kathmandu Head Office & Showroom'
                        },
                        {
                            '@type': 'PostalAddress',
                            addressLocality: 'Dhangadhi',
                            addressRegion: 'Sudurpashchim Province',
                            postalCode: '10900',
                            addressCountry: 'NP',
                            description: 'Dhangadhi Regional Office & Showroom'
                        }
                    ],
                    geo: [
                        {
                            '@type': 'GeoCoordinates',
                            latitude: 27.7228,
                            longitude: 85.2878,
                            name: 'Kathmandu Office'
                        }
                    ],
                    areaServed: [
                        { '@type': 'City', name: 'Kathmandu' },
                        { '@type': 'City', name: 'Dhangadhi' },
                        { '@type': 'Country', name: 'Nepal' }
                    ],
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'Product Catalog',
                        itemListElement: [
                            {
                                '@type': 'OfferCatalog',
                                name: 'Science Lab Products',
                                description: 'Physics, chemistry, biology lab instruments, glassware, microscopes, and complete laboratory setups.'
                            },
                            {
                                '@type': 'OfferCatalog',
                                name: 'Civil Engineering Equipment',
                                description: 'Soil testing, concrete testing, aggregate, surveying, and material testing apparatus.'
                            },
                            {
                                '@type': 'OfferCatalog',
                                name: 'Math Lab and Learning Tools',
                                description: 'Mathematical models, geometry kits, abacus, and interactive numeracy tools.'
                            },
                            {
                                '@type': 'OfferCatalog',
                                name: 'Montessori Kids Materials',
                                description: 'Early childhood development (ECD) materials, sensory toys, and Montessori educational kits.'
                            }
                        ]
                    },
                    openingHoursSpecification: [
                        {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                            opens: '09:00',
                            closes: '18:00'
                        }
                    ]
                },
                {
                    '@type': 'FAQPage',
                    '@id': 'https://globalscientifictrade.com.np/#faq',
                    mainEntity: [
                        {
                            '@type': 'Question',
                            name: 'What products does Global Scientific Trade sell in Nepal?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Global Scientific Trade sells four primary categories across Nepal: 1) Science Lab Products (physics, chemistry, biology glassware and instruments), 2) Civil Engineering Equipment (soil, concrete, and survey apparatus), 3) Math Lab and Learning Tools, and 4) Montessori Kids Materials and ECD educational toys.'
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Where can I buy science lab products and civil engineering equipment in Kathmandu?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'You can buy science lab products and civil engineering equipment directly from Global Scientific Trade located in Swayambhu, Kathmandu. Call our landline at +977 1-5924298 for orders and quotations.'
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Does Global Scientific Trade sell math lab tools and Montessori kids materials in Dhangadhi?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes, Global Scientific Trade has a dedicated regional showroom in Dhangadhi, Sudurpashchim, supplying math lab kits, learning tools, and Montessori kids materials. Contact our Dhangadhi office at +977 91-591014 or +977 9847879700.'
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Do you provide delivery for laboratory equipment across Nepal?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes, Global Scientific Trade delivers science lab products, civil engineering equipment, math lab tools, and Montessori kids materials to schools, colleges, engineering firms, and institutions nationwide across all 7 provinces of Nepal.'
                            }
                        }
                    ]
                }
            ]
        }
    });

    useEffect(() => {
        api.getProducts({ featured: 'true', limit: 8 })
            .then(res => setFeaturedProducts(res.products || []))
            .catch(err => console.error('Failed to load featured products', err))
            .finally(() => setLoadingProducts(false));
    }, []);

    const getCategoryIcon = (slug) => {
        if (slug.includes('science')) return <Microscope className="w-8 h-8 text-emerald-600" />;
        if (slug.includes('civil')) return <HardHat className="w-8 h-8 text-amber-600" />;
        if (slug.includes('math')) return <Compass className="w-8 h-8 text-blue-600" />;
        if (slug.includes('bal') || slug.includes('ecd')) return <Baby className="w-8 h-8 text-rose-600" />;
        return <Microscope className="w-8 h-8 text-brand-600" />;
    };

    return (
        <div className="space-y-16 pb-16">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
                {/* Background decorative geometry */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f3a417_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-700/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 bg-brand-800/80 border border-brand-700 text-gold-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Trusted Supplier in Kathmandu & Dhangadhi, Nepal</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                                Precision Scientific & <br className="hidden sm:inline" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                                    Engineering Solutions
                                </span>
                            </h1>

                            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                Delivering complete laboratory setups, precision civil engineering apparatus, mathematics learning tools, and early childhood materials across Nepal.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    to="/products"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-gold-500/20 flex items-center justify-center space-x-2"
                                >
                                    <span>Explore Catalog</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    to="/contact"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-800/70 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl border border-brand-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <span>Request Quotation</span>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-800/80 text-left">
                                <div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-gold-400">100%</div>
                                    <div className="text-xs text-slate-300 font-medium">Genuine Equipment</div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-white">4+</div>
                                    <div className="text-xs text-slate-300 font-medium">Core Departments</div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-gold-400">Nationwide</div>
                                    <div className="text-xs text-slate-300 font-medium">Delivery & Setup</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Card / Brand Showcase */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md bg-gradient-to-b from-brand-900 to-brand-950 p-6 rounded-3xl border border-brand-700 shadow-2xl space-y-6">
                                <div className="flex items-center space-x-4 border-b border-brand-800 pb-4">
                                    <img
                                        src="/logo.jpeg"
                                        alt="Global Scientific Trade Pvt. Ltd."
                                        className="w-16 h-16 rounded-2xl object-contain bg-white p-1 shadow-md"
                                    />
                                    <div>
                                        <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">Official Supplier</div>
                                        <h3 className="text-base font-extrabold text-white">GLOBAL SCIENTIFIC TRADE</h3>
                                        <span className="text-xs text-slate-300">Pvt. Ltd. • Kathmandu & Dhangadhi</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Specialized Divisions:
                                    </div>
                                    <div className="space-y-2">
                                        {categories.slice(0, 4).map(cat => (
                                            <Link
                                                key={cat.id}
                                                to={`/category/${cat.slug}`}
                                                className="flex items-center justify-between p-2.5 rounded-xl bg-brand-800/40 hover:bg-brand-800 border border-brand-700/50 text-xs transition-colors group"
                                            >
                                                <span className="font-semibold text-slate-200 group-hover:text-gold-300 truncate">
                                                    {cat.name}
                                                </span>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-300 shrink-0 ml-2" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-brand-900/90 rounded-2xl p-4 border border-brand-800 space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-brand-800/80">
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Kathmandu Office:</span>
                                            <a href="tel:+97715924298" className="font-bold text-gold-400 font-mono text-sm hover:underline">
                                                +977 1-5924298
                                            </a>
                                        </div>
                                        <span className="text-[10px] bg-brand-800 text-slate-300 px-2 py-0.5 rounded border border-brand-700">Landline</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-0.5">
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dhangadhi Office:</span>
                                            <div className="flex items-center space-x-2 font-bold text-gold-400 font-mono text-xs mt-0.5">
                                                <a href="tel:+97791591014" className="hover:underline" title="Landline">+977 91-591014</a>
                                                <span className="text-slate-500">•</span>
                                                <a href="tel:+9779847879700" className="hover:underline" title="Mobile">+977 9847879700</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCT DEPARTMENTS SHOWCASE */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Specialized Disciplines</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Our Four Primary Catalogs
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="text-sm font-bold text-brand-700 hover:text-brand-900 flex items-center space-x-1"
                    >
                        <span>Browse Entire Inventory</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-brand-50 border border-slate-200/80 flex items-center justify-center mb-5 transition-colors overflow-hidden">
                                    {cat.thumbnail_url || cat.image_url ? (
                                        <img
                                            src={cat.thumbnail_url || cat.image_url}
                                            alt={cat.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getCategoryIcon(cat.slug)
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-brand-700 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                                <span>{cat.product_count || 0} Products</span>
                                <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                                    <span>Explore</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS SECTION */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Precision Selection</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Featured Products & Instruments
                        </h2>
                    </div>
                    <Link
                        to="/products?featured=true"
                        className="text-sm font-bold text-brand-700 hover:text-brand-900 flex items-center space-x-1"
                    >
                        <span>View All Featured</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse p-4"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* WHY CHOOSE US & CORE FACILITIES */}
            <section className="bg-gradient-to-b from-slate-100 to-slate-50 py-16 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Institutional Competence</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                            Why Choose Global Scientific Trade
                        </h2>
                        <p className="text-sm text-slate-600 mt-2">
                            Operating from our offices in Swayambhu, Kathmandu and Dhangadhi, we serve secondary schools, universities, medical labs, and civil engineering testing centers across Nepal.
                        </p>
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
                            'Nationwide Fast Delivery'
                        ]).map((fac, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start space-x-3.5"
                            >
                                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 text-brand-700 font-bold text-xs">
                                    <CheckCircle2 className="w-5 h-5 text-brand-700" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{fac}</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Compliant with institutional standards and technical verification.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-brand-800">
                    <div className="space-y-3 max-w-xl text-center md:text-left">
                        <span className="text-xs uppercase font-bold tracking-wider text-gold-400">
                            Custom Lab Setup & Procurement
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Setting up a new lab or need an institutional quotation?
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Our team provides turnkey technical consultations, itemized proforma invoices, and safe nationwide delivery.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link
                            to="/contact"
                            className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md text-center"
                        >
                            Request Formal Quotation
                        </Link>
                        <a
                            href="tel:+97715924298"
                            className="px-5 py-3 bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-brand-700 transition-colors text-center"
                            title="Kathmandu Office Landline"
                        >
                            KTM: +977 1-5924298
                        </a>
                        <a
                            href="tel:+9779847879700"
                            className="px-5 py-3 bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-brand-700 transition-colors text-center"
                            title="Dhangadhi Office Mobile"
                        >
                            Dhangadhi: +977 9847879700
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
