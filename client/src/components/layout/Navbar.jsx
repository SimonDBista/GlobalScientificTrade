import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Phone, Mail, MapPin, ShoppingCart, Search, Menu, X, ChevronDown,
    Shield, ArrowRight, Lock, Layers, Microscope, HardHat, Compass, Baby
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { itemCount } = useCart();
    const { settings, categories } = useSettings();
    const { isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    const getCategoryIcon = (slug) => {
        if (slug.includes('science')) return <Microscope className="w-4 h-4 text-emerald-600" />;
        if (slug.includes('civil')) return <HardHat className="w-4 h-4 text-amber-600" />;
        if (slug.includes('math')) return <Compass className="w-4 h-4 text-blue-600" />;
        if (slug.includes('bal') || slug.includes('ecd')) return <Baby className="w-4 h-4 text-rose-600" />;
        return <Layers className="w-4 h-4 text-brand-600" />;
    };

    return (
        <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
            {/* Top Bar */}
            <div className="bg-brand-950 text-slate-200 text-xs py-2 px-4 border-b border-brand-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                    {/* Left: Contact Info */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-slate-300">
                        <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>Kathmandu & Dhangadhi</span>
                        </div>
                        <a href="tel:+97715924298" className="flex items-center space-x-1 hover:text-gold-400 transition-colors" title="Kathmandu Office Landline">
                            <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span className="text-slate-400 text-[11px] font-semibold">KTM:</span>
                            <span>+977 1-5924298</span>
                        </a>
                        <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-[11px] font-semibold">Dhangadhi:</span>
                            <a href="tel:+97791591014" className="hover:text-gold-400 transition-colors" title="Dhangadhi Landline">
                                +977 91-591014
                            </a>
                            <span className="text-slate-500">•</span>
                            <a href="tel:+9779847879700" className="hover:text-gold-400 transition-colors" title="Dhangadhi Mobile">
                                +977 9847879700
                            </a>
                        </div>
                        <a href="mailto:gsciencehouse2077@gmail.com" className="hidden xl:flex items-center space-x-1.5 hover:text-gold-400 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>gsciencehouse2077@gmail.com</span>
                        </a>
                    </div>

                    {/* Right: Assurance (Staff Portal removed per user instruction) */}
                    <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1 text-gold-400 font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Nationwide Delivery & Institutional Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Brand Logo & Name */}
                <Link to="/" className="flex items-center space-x-3 shrink-0 group">
                    <img
                        src="/logo.jpeg"
                        alt="Global Scientific Trade Logo"
                        className="w-12 h-12 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-950 leading-tight">
                            GLOBAL <span className="text-gold-600">SCIENTIFIC</span>
                        </span>
                        <span className="text-[10px] sm:text-xs tracking-wider uppercase font-bold text-slate-600">
                            TRADE PVT. LTD.
                        </span>
                    </div>
                </Link>

                {/* Search Bar - Desktop */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
                    <input
                        type="text"
                        placeholder="Search instruments, models (e.g. CTM, microscope, abacus)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm pl-4 pr-10 py-2 border border-slate-300 rounded-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-all shadow-xs"
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 p-1 rounded-full bg-brand-800 hover:bg-brand-900 text-white transition-colors"
                        title="Search"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
                    <Link
                        to="/"
                        className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === '/' ? 'text-brand-900 font-bold bg-brand-50' : 'hover:text-brand-900 hover:bg-slate-50'}`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === '/about' ? 'text-brand-900 font-bold bg-brand-50' : 'hover:text-brand-900 hover:bg-slate-50'}`}
                    >
                        About Us
                    </Link>

                    {/* Dynamic Categories Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setCategoryDropdownOpen(true)}
                        onMouseLeave={() => setCategoryDropdownOpen(false)}
                    >
                        <button
                            type="button"
                            className="px-3 py-2 rounded-lg flex items-center space-x-1 hover:text-brand-900 hover:bg-slate-50 transition-colors"
                        >
                            <span>Departments</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {categoryDropdownOpen && (
                            <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                                <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                    Product Catalogs
                                </div>
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        to={`/category/${cat.slug}`}
                                        onClick={() => setCategoryDropdownOpen(false)}
                                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-brand-50 text-slate-700 hover:text-brand-900 transition-colors"
                                    >
                                        <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                                            {getCategoryIcon(cat.slug)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold truncate">{cat.name}</div>
                                            <span className="text-[11px] text-slate-500">{cat.product_count || 0} products</span>
                                        </div>
                                    </Link>
                                ))}
                                <div className="px-3 pt-2 mt-1 border-t border-slate-100">
                                    <Link
                                        to="/products"
                                        onClick={() => setCategoryDropdownOpen(false)}
                                        className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50"
                                    >
                                        <span>Browse Full Catalog</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/products"
                        className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === '/products' ? 'text-brand-900 font-bold bg-brand-50' : 'hover:text-brand-900 hover:bg-slate-50'}`}
                    >
                        All Products
                    </Link>

                    <Link
                        to="/contact"
                        className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === '/contact' ? 'text-brand-900 font-bold bg-brand-50' : 'hover:text-brand-900 hover:bg-slate-50'}`}
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* Right Action: Cart & Quote CTA */}
                <div className="flex items-center space-x-3">
                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-brand-900 transition-colors border border-slate-200"
                        title="View Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gold-500 text-slate-950 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {/* Instant Quote Button */}
                    <Link
                        to="/contact"
                        className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                        <span>Request Quote</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in-50">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search equipment, models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm pl-4 pr-10 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-hidden"
                        />
                        <button type="submit" className="absolute right-2 top-2 text-slate-500">
                            <Search className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="space-y-1 font-medium text-slate-700">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                            About Us
                        </Link>
                        <Link
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                            All Products Catalog
                        </Link>

                        <div className="pt-2 pb-1 text-xs font-bold text-slate-600 uppercase tracking-wider px-3">
                            Departments
                        </div>
                        {categories.map(c => (
                            <Link
                                key={c.id}
                                to={`/category/${c.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                            >
                                {getCategoryIcon(c.slug)}
                                <span>{c.name}</span>
                            </Link>
                        ))}

                        <Link
                            to="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
