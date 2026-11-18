import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Edit, Trash2, Layers, CheckCircle2, XCircle, ArrowRight,
    AlertCircle, Image, Save, X, ExternalLink
} from 'lucide-react';
import { api } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminCategories() {
    const { refreshSettings } = useSettings();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state for Add / Edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        thumbnail_url: '',
        display_order: 0,
        is_active: 1
    });
    const [saving, setSaving] = useState(false);

    const loadCategories = () => {
        setLoading(true);
        api.getCategories(true)
            .then(res => setCategories(res.categories || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            image_url: '',
            thumbnail_url: '',
            display_order: categories.length + 1,
            is_active: 1
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (cat) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            image_url: cat.image_url || '',
            thumbnail_url: cat.thumbnail_url || '',
            display_order: cat.display_order || 0,
            is_active: cat.is_active ? 1 : 0
        });
        setModalOpen(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingCategory) {
                await api.updateCategory(editingCategory.id, formData);
            } else {
                await api.createCategory(formData);
            }
            setModalOpen(false);
            loadCategories();
            refreshSettings();
        } catch (err) {
            setError(err.message || 'Failed to save category.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (cat) => {
        if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

        try {
            await api.deleteCategory(cat.id);
            loadCategories();
            refreshSettings();
        } catch (err) {
            alert(err.message || 'Failed to delete category.');
        }
    };

    const handleToggleStatus = async (cat) => {
        try {
            await api.updateCategory(cat.id, { is_active: cat.is_active ? 0 : 1 });
            loadCategories();
            refreshSettings();
        } catch (err) {
            alert(err.message || 'Failed to update category status.');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Dynamic Category Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Create, organize, and edit product departments visible across the public site.
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-center">Order</th>
                                <th className="py-3.5 px-4">Category Name & Slug</th>
                                <th className="py-3.5 px-4">Description</th>
                                <th className="py-3.5 px-4 text-center">Products</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/80">
                                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                                        {cat.display_order}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            {cat.thumbnail_url || cat.image_url ? (
                                                <img
                                                    src={cat.thumbnail_url || cat.image_url}
                                                    alt={cat.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 text-sm truncate">{cat.name}</div>
                                                <div className="font-mono text-[11px] text-slate-400">/{cat.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                                        {cat.description || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/admin/products?category_id=${cat.id}`}
                                            className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-900 border border-brand-200 hover:bg-brand-100 transition-colors"
                                            title="View products in this category"
                                        >
                                            {cat.product_count || 0} items
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(cat)}
                                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                                cat.is_active
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {cat.is_active ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3" />
                                                    <span>Inactive</span>
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                to={`/category/${cat.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                                title="View on public site"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleOpenEdit(cat)}
                                                className="p-1.5 text-slate-600 hover:text-brand-800 rounded-lg hover:bg-slate-100"
                                                title="Edit Category"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add / Edit Category */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCategory} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Geotechnical & Soil Laboratory"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    URL Slug (Leave empty to auto-generate)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. geotechnical-soil-lab"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Summary of products and equipment in this department..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none"
                                />
                            </div>

                            <ImageUploader
                                label="Category Cover Image (Auto-Optimized to WebP)"
                                type="category"
                                value={formData.image_url}
                                thumbnailValue={formData.thumbnail_url}
                                onChange={({ url, thumbnailUrl }) => {
                                    setFormData({
                                        ...formData,
                                        image_url: url,
                                        thumbnail_url: thumbnailUrl || url
                                    });
                                }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Public Status
                                    </label>
                                    <select
                                        value={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                    >
                                        <option value={1}>Active & Visible</option>
                                        <option value={0}>Inactive (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
