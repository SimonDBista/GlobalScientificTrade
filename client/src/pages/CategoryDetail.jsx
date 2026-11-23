import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Layers, Microscope, HardHat, Compass, Baby } from 'lucide-react';
import { api } from '../api/client';
import ProductCard from '../components/ui/ProductCard';
import useSEO from '../hooks/useSEO';

export default function CategoryDetail() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useSEO({
        title: category ? `${category.name} — Equipment Catalog` : 'Product Category',
        description: category
            ? `Browse our ${category.name} collection. ${category.description || 'High-quality equipment for schools, colleges, and institutions in Nepal.'}`
            : 'Browse our scientific and educational equipment categories.',
        url: `/category/${slug}`,
        jsonLd: category ? {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.name,
            description: category.description || `${category.name} equipment catalog`,
            url: `https://globalscientifictrade.com.np/category/${slug}`,
            publisher: {
                '@type': 'Organization',
                name: 'Global Scientific Trade Pvt. Ltd.',
                url: 'https://globalscientifictrade.com.np'
            }
        } : null
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.getCategory(slug),
            api.getProducts({ category_slug: slug, limit: 100 })
        ])
        .then(([catRes, prodRes]) => {
            setCategory(catRes.category);
            setProducts(prodRes.products || []);
        })
        .catch(err => console.error('Failed to load category products', err))
        .finally(() => setLoading(false));
    }, [slug]);

    const getIcon = (catSlug = '') => {
        if (catSlug.includes('science')) return <Microscope className="w-10 h-10 text-emerald-400" />;
        if (catSlug.includes('civil')) return <HardHat className="w-10 h-10 text-amber-400" />;
        if (catSlug.includes('math')) return <Compass className="w-10 h-10 text-blue-400" />;
        if (catSlug.includes('bal') || catSlug.includes('ecd')) return <Baby className="w-10 h-10 text-rose-400" />;
        return <Layers className="w-10 h-10 text-gold-400" />;
    };

    const filtered = products.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) ||
               (p.model_number && p.model_number.toLowerCase().includes(q)) ||
               (p.short_description && p.short_description.toLowerCase().includes(q));
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Loading department catalog...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
                <Link to="/products" className="text-sm font-semibold text-brand-700 hover:underline">
                    Back to All Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header Banner */}
            <div className="bg-brand-950 text-white py-12 border-b border-brand-900">
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        to="/products"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>All Product Catalogs</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-brand-900 rounded-2xl border border-brand-800 shrink-0 flex items-center justify-center overflow-hidden">
                                {category.thumbnail_url || category.image_url ? (
                                    <img
                                        src={category.thumbnail_url || category.image_url}
                                        alt={category.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getIcon(category.slug)
                                )}
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gold-400">
                                    Product Department
                                </span>
                                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                                    {category.name}
                                </h1>
                                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-brand-900/60 p-4 rounded-2xl border border-brand-800 text-center shrink-0">
                            <span className="text-2xl font-extrabold text-gold-400 block font-mono">
                                {products.length}
                            </span>
                            <span className="text-xs text-slate-300 font-medium">Cataloged Instruments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Content Area */}
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Search in Category */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder={`Search inside ${category.name}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>

                    <div className="text-xs text-slate-500">
                        Showing <span className="font-bold text-slate-800">{filtered.length}</span> products
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filtered.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                        <p className="text-sm font-semibold text-slate-700">No instruments match your search in this department.</p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="text-xs text-brand-700 hover:underline font-bold"
                            >
                                Clear search query
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
