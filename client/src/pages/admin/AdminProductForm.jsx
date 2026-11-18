import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Upload, Plus, Trash2, Image, AlertCircle,
    CheckCircle2, Sparkles, Layers, Box
} from 'lucide-react';
import { api } from '../../api/client';
import { useSettings } from '../../context/SettingsContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const { categories } = useSettings();

    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        slug: '',
        model_number: '',
        sku: '',
        brand: 'Global Scientific',
        short_description: '',
        full_description: '',
        price: '',
        price_type: 'quote_only',
        availability: 'in_stock',
        is_featured: 0,
        is_active: 1,
        primary_image: '',
        thumbnail_image: ''
    });

    const [specifications, setSpecifications] = useState([
        { spec_name: 'Material', spec_value: '' },
        { spec_name: 'Dimensions', spec_value: '' }
    ]);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            api.getProduct(id)
                .then(res => {
                    const p = res.product;
                    setFormData({
                        category_id: p.category_id || '',
                        name: p.name || '',
                        slug: p.slug || '',
                        model_number: p.model_number || '',
                        sku: p.sku || '',
                        brand: p.brand || 'Global Scientific',
                        short_description: p.short_description || '',
                        full_description: p.full_description || '',
                        price: p.price !== null && p.price !== undefined ? p.price : '',
                        price_type: p.price_type || 'quote_only',
                        availability: p.availability || 'in_stock',
                        is_featured: p.is_featured ? 1 : 0,
                        is_active: p.is_active ? 1 : 0,
                        primary_image: p.primary_image || '',
                        thumbnail_image: p.thumbnail_image || ''
                    });

                    if (p.specifications && p.specifications.length > 0) {
                        setSpecifications(p.specifications);
                    }
                })
                .catch(err => setError(err.message))
                .finally(() => setLoadingData(false));
        } else if (categories.length > 0) {
            setFormData(prev => ({ ...prev, category_id: categories[0].id }));
        }
    }, [id, isEdit, categories]);

    // Handle File Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const res = await api.uploadImage(file);
            setFormData(prev => ({ ...prev, primary_image: res.url }));
        } catch (err) {
            setError(err.message || 'Image upload failed. Allowed types: jpg, png, webp, svg.');
        } finally {
            setUploading(false);
        }
    };

    // Spec Rows handlers
    const addSpecRow = () => {
        setSpecifications([...specifications, { spec_name: '', spec_value: '' }]);
    };

    const updateSpecRow = (idx, field, value) => {
        const next = [...specifications];
        next[idx][field] = value;
        setSpecifications(next);
    };

    const removeSpecRow = (idx) => {
        setSpecifications(specifications.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const cleanSpecs = specifications.filter(s => s.spec_name.trim() !== '' && s.spec_value.trim() !== '');

            const payload = {
                ...formData,
                category_id: parseInt(formData.category_id),
                price: formData.price !== '' ? parseFloat(formData.price) : null,
                specifications: cleanSpecs
            };

            if (isEdit) {
                await api.updateProduct(id, payload);
            } else {
                await api.createProduct(payload);
            }

            navigate('/admin/products');
        } catch (err) {
            setError(err.message || 'Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-medium">Loading product data...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                    <Link
                        to="/admin/products"
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-white transition-colors border border-slate-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            {isEdit ? `Edit Product: ${formData.name}` : 'Add New Product / Instrument'}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Configure full technical parameters, images, and category assignments.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        to="/admin/products"
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Product'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Form: Main Info */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Basic Info Box */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                            <Box className="w-4 h-4 text-brand-700" />
                            <span>1. Basic Product Identity</span>
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Digital Automatic Compression Testing Machine 2000KN"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Model Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. ACTM-2000KN"
                                    value={formData.model_number}
                                    onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    SKU Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. CIV-CON-001"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Brand / Manufacturer
                                </label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Short Overview Description
                            </label>
                            <input
                                type="text"
                                placeholder="One-line summary for product cards and search results..."
                                value={formData.short_description}
                                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Detailed Description & Laboratory Application
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Detailed operational principles, construction materials, test standards, and accessories included..."
                                value={formData.full_description}
                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Flexible Technical Specifications Manager */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    2. Flexible Technical Specifications
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Add custom specification rows (e.g. Dimensions, Capacity, Accuracy, Voltage, Material, Range).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addSpecRow}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Row</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {specifications.map((spec, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Parameter (e.g. Capacity)"
                                        value={spec.spec_name}
                                        onChange={(e) => updateSpecRow(idx, 'spec_name', e.target.value)}
                                        className="w-1/3 text-xs p-2 border border-slate-300 rounded-lg font-semibold focus:outline-hidden"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 2000 KN / 220V 50Hz)"
                                        value={spec.spec_value}
                                        onChange={(e) => updateSpecRow(idx, 'spec_value', e.target.value)}
                                        className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:outline-hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpecRow(idx)}
                                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                                        title="Remove specification"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form: Category, Pricing, Image Upload & Status */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Organization & Category */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-brand-700" />
                            <span>Department & Category</span>
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Product Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-hidden font-bold"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Pricing Mode
                                </label>
                                <select
                                    value={formData.price_type}
                                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-hidden"
                                >
                                    <option value="quote_only">Request a Quote (No fixed price)</option>
                                    <option value="fixed_price">Fixed Price / Direct Buy</option>
                                    <option value="both">Both (Fixed Price + Custom Quote)</option>
                                </select>
                            </div>

                            {formData.price_type !== 'quote_only' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Price in NPR
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 4500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full text-xs p-2 border border-slate-300 rounded-xl font-bold focus:outline-hidden"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Stock Availability
                                </label>
                                <select
                                    value={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                    className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-hidden font-medium"
                                >
                                    <option value="in_stock">In Stock (Kathmandu Hub)</option>
                                    <option value="on_order">Available on Order</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-3 pt-2">
                                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(formData.is_featured)}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                                        className="w-4 h-4 text-brand-700 rounded"
                                    />
                                    <span>Mark as Featured Product</span>
                                </label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(formData.is_active)}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                                        className="w-4 h-4 text-brand-700 rounded"
                                    />
                                    <span>Active (Publicly Visible)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Product Image Upload Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <ImageUploader
                            value={formData.primary_image}
                            thumbnailValue={formData.thumbnail_image}
                            type="product"
                            label="Product Image (Auto-Optimized)"
                            onChange={({ url, thumbnail_url }) => {
                                setFormData(prev => ({
                                    ...prev,
                                    primary_image: url,
                                    thumbnail_image: thumbnail_url
                                }));
                            }}
                        />

                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Note: If no image is uploaded, an elegant category schematic will be rendered automatically.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
