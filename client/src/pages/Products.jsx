import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search, Filter, X, SlidersHorizontal, RefreshCw, AlertCircle,
    CheckCircle2, Layers
} from 'lucide-react';
import { api } from '../api/client';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ui/ProductCard';
import useSEO from '../hooks/useSEO';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categories } = useSettings();

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useSEO({
        title: 'Products — Science Lab, Civil Engineering, Math & Montessori Catalog',
        description: 'Explore our full catalog: science lab products, civil engineering equipment, math lab and learning tools, and Montessori kids materials. In-stock with supply and dispatch in Kathmandu and Dhangadhi, Nepal.',
        keywords: 'science lab product, civil engineering equipment, math lab and learning tools, montessori kids material, lab equipment catalog Nepal, science apparatus Kathmandu, civil testing Dhangadhi',
        url: '/products'
    });

    // Filters
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || '';
    const selectedAvailability = searchParams.get('availability') || '';
    const selectedPriceType = searchParams.get('price_type') || '';
    const sortBy = searchParams.get('sort') || 'featured';

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        setSearchParams(next);
    };

    const clearAllFilters = () => {
        setSearchParams({});
    };

    useEffect(() => {
        setLoading(true);
        const params = {
            search: searchQuery,
            category_slug: selectedCategory,
            availability: selectedAvailability,
            price_type: selectedPriceType,
            sort: sortBy,
            limit: 100
        };

        api.getProducts(params)
            .then(res => {
                setProducts(res.products || []);
                setTotal(res.total || 0);
            })
            .catch(err => console.error('Failed to load products', err))
            .finally(() => setLoading(false));
    }, [searchQuery, selectedCategory, selectedAvailability, selectedPriceType, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header & Search Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Scientific & Industrial Product Catalog
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Browse instruments, models, testing equipment, and educational supplies.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="lg:hidden px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products by title, model number, SKU (e.g. VC-IME-150, CTM, Vernier)..."
                        value={searchQuery}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full text-sm pl-11 pr-10 py-3 border border-slate-300 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-all shadow-xs"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    {searchQuery && (
                        <button
                            onClick={() => updateFilter('search', '')}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filter Sidebar */}
                <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                                <Filter className="w-4 h-4 text-brand-700" />
                                <span>Filter Products</span>
                            </h3>
                            {(searchQuery || selectedCategory || selectedAvailability || selectedPriceType) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-brand-700 hover:underline font-semibold"
                                >
                                    Reset All
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                Departments
                            </label>
                            <div className="space-y-1">
                                <button
                                    onClick={() => updateFilter('category', '')}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${!selectedCategory ? 'bg-brand-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <span>All Departments</span>
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateFilter('category', cat.slug)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? 'bg-brand-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        <span className="truncate pr-2">{cat.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === cat.slug ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {cat.product_count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                Availability
                            </label>
                            <div className="space-y-1">
                                {[
                                    { label: 'All Items', val: '' },
                                    { label: 'In Stock', val: 'in_stock' },
                                    { label: 'Available on Order', val: 'on_order' }
                                ].map(av => (
                                    <button
                                        key={av.val}
                                        onClick={() => updateFilter('availability', av.val)}
                                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${selectedAvailability === av.val ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {av.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Type Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                Purchase Options
                            </label>
                            <div className="space-y-1">
                                {[
                                    { label: 'All Options', val: '' },
                                    { label: 'Fixed Price / Direct Buy', val: 'fixed_price' },
                                    { label: 'Quotation on Request', val: 'quote_only' }
                                ].map(pt => (
                                    <button
                                        key={pt.val}
                                        onClick={() => updateFilter('price_type', pt.val)}
                                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${selectedPriceType === pt.val ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {pt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Results Grid */}
                <main className="lg:col-span-3 space-y-4">
                    {/* Sort & Count Bar */}
                    <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-600">
                            Showing <span className="font-bold text-slate-900">{products.length}</span> of <span className="font-bold text-slate-900">{total}</span> total instruments
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-slate-500 font-medium">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                                className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            >
                                <option value="featured">Featured First</option>
                                <option value="newest">Newest First</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse p-4"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(prod => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                We could not find any products matching your current filters. Try searching with a different term or reset your filters.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold rounded-xl"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
