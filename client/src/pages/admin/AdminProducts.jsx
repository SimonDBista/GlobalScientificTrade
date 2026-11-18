import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Plus, Search, Edit, Copy, Trash2, ExternalLink, Filter,
    CheckCircle2, XCircle, AlertCircle, Eye, Star
} from 'lucide-react';
import { api } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';

export default function AdminProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categories } = useSettings();

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryId = searchParams.get('category_id') || '';
    const searchQuery = searchParams.get('search') || '';

    const loadProducts = () => {
        setLoading(true);
        api.getProducts({
            category_id: categoryId,
            search: searchQuery,
            all: 'true',
            limit: 200
        })
        .then(res => {
            setProducts(res.products || []);
            setTotal(res.total || 0);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, [categoryId, searchQuery]);

    const handleDuplicate = async (prod) => {
        if (!window.confirm(`Duplicate "${prod.name}"?`)) return;
        try {
            await api.duplicateProduct(prod.id);
            loadProducts();
        } catch (err) {
            alert(err.message || 'Failed to duplicate product.');
        }
    };

    const handleDelete = async (prod) => {
        if (!window.confirm(`Are you sure you want to delete "${prod.name}"?`)) return;
        try {
            await api.deleteProduct(prod.id);
            loadProducts();
        } catch (err) {
            alert(err.message || 'Failed to delete product.');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Product & Apparatus Catalog
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage specifications, image galleries, prices, and availability.
                    </p>
                </div>

                <Link
                    to="/admin/products/new"
                    className="px-4 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name, model, SKU..."
                        value={searchQuery}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set('search', e.target.value);
                            else next.delete('search');
                            setSearchParams(next);
                        }}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <select
                        value={categoryId}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set('category_id', e.target.value);
                            else next.delete('category_id');
                            setSearchParams(next);
                        }}
                        className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-medium focus:outline-hidden"
                    >
                        <option value="">All Categories ({total})</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.product_count || 0})
                            </option>
                        ))}
                    </select>

                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        Total: <span className="font-bold text-slate-900">{products.length}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Product Name</th>
                                <th className="py-3 px-4">Department</th>
                                <th className="py-3 px-4">Model / SKU</th>
                                <th className="py-3 px-4">Price / Mode</th>
                                <th className="py-3 px-4 text-center">Availability</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((prod) => (
                                <tr key={prod.id} className="hover:bg-slate-50/80">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            {prod.is_featured ? (
                                                <Star className="w-3.5 h-3.5 text-gold-500 fill-current shrink-0" title="Featured" />
                                            ) : null}
                                            <span className="font-bold text-slate-900 line-clamp-1">{prod.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-brand-800 font-semibold truncate max-w-[140px]">
                                        {prod.category_name}
                                    </td>
                                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                                        {prod.model_number || prod.sku || '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {prod.price ? (
                                            <span className="font-bold text-slate-900">
                                                NPR {parseFloat(prod.price).toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                Quote
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            prod.availability === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {prod.availability === 'in_stock' ? 'In Stock' : 'On Order'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            prod.is_active ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {prod.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end space-x-1.5">
                                            <Link
                                                to={`/products/${prod.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                                title="View Public Page"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                            <Link
                                                to={`/admin/products/${prod.id}/edit`}
                                                className="p-1.5 text-brand-700 hover:text-brand-900 rounded-lg hover:bg-slate-100"
                                                title="Edit Product"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDuplicate(prod)}
                                                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                                                title="Duplicate Product"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prod)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
