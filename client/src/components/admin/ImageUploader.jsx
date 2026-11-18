import React, { useState } from 'react';
import {
    Upload, Image as ImageIcon, Trash2, CheckCircle2, Sparkles,
    AlertCircle, RefreshCw, FileText, Zap, Eye
} from 'lucide-react';
import { api } from '../../api/client';

export default function ImageUploader({
    value = '',
    thumbnailValue = '',
    onChange,
    type = 'product', // 'product' or 'category'
    label = 'Product Image'
}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [optimizationStats, setOptimizationStats] = useState(null);
    const [previewTab, setPreviewTab] = useState('main'); // 'main' or 'thumb'

    const formatBytes = (bytes, decimals = 1) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Client validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG, WebP, AVIF, TIFF, etc.).');
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            setError('File size exceeds 25MB limit. Please choose a smaller image.');
            return;
        }

        setError(null);
        setUploading(true);
        setProgress(20);

        const progressInterval = setInterval(() => {
            setProgress(prev => (prev < 85 ? prev + 15 : prev));
        }, 150);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await api.uploadImage(file, type);
            clearInterval(progressInterval);
            setProgress(100);

            // Pass both main and thumbnail URLs to parent
            if (onChange) {
                onChange({
                    url: res.url,
                    thumbnail_url: res.thumbnail_url,
                    thumbnailUrl: res.thumbnail_url
                });
            }

            setOptimizationStats(res);
        } catch (err) {
            clearInterval(progressInterval);
            setError(err.message || 'Image compression failed. Please check the image format.');
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange({ url: '', thumbnail_url: '' });
        }
        setOptimizationStats(null);
        setError(null);
    };

    const currentUrl = previewTab === 'thumb' && (thumbnailValue || (optimizationStats && optimizationStats.thumbnail_url))
        ? (thumbnailValue || optimizationStats.thumbnail_url)
        : value;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                    {label}
                </label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Auto-WebP & Resize</span>
                </span>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {value ? (
                <div className="space-y-3">
                    {/* Image Preview Box */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 shadow-xs group">
                        <div className="w-full h-48 flex items-center justify-center bg-slate-100/60 rounded-xl overflow-hidden">
                            <img
                                src={currentUrl}
                                alt="Uploaded preview"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Top Overlay Buttons */}
                        <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors"
                                title="Remove Image"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Switch between Main and Thumbnail view if available */}
                        {(thumbnailValue || (optimizationStats && optimizationStats.thumbnail_url)) && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 px-1 text-xs">
                                <span className="text-[11px] font-medium text-slate-500">Preview Variant:</span>
                                <div className="flex items-center space-x-1 bg-slate-200/70 p-0.5 rounded-lg text-[11px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('main')}
                                        className={`px-2 py-0.5 rounded-md transition-colors ${previewTab === 'main' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                                    >
                                        Main (1200px)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('thumb')}
                                        className={`px-2 py-0.5 rounded-md transition-colors ${previewTab === 'thumb' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                                    >
                                        Thumbnail (450px)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Optimization Metrics Pill */}
                    {optimizationStats && (
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 shadow-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Optimized & Converted to WebP</span>
                                </div>
                                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                                    {optimizationStats.saved_percent}% Saved
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60 font-mono">
                                <div>
                                    <span className="text-slate-400">Original: </span>
                                    <strong>{formatBytes(optimizationStats.original_size)}</strong> ({optimizationStats.original_dimensions})
                                </div>
                                <div>
                                    <span className="text-slate-400">WebP Main: </span>
                                    <strong className="text-emerald-800">{formatBytes(optimizationStats.size)}</strong> ({optimizationStats.optimized_dimensions})
                                </div>
                                <div>
                                    <span className="text-slate-400">Thumbnail: </span>
                                    <strong className="text-emerald-800">{formatBytes(optimizationStats.thumbnail_size)}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400">EXIF Meta: </span>
                                    <strong className="text-emerald-800">Stripped</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replace Image Button */}
                    <div>
                        <label className="w-full py-2 px-3 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs">
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Replace with Another Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            ) : (
                /* Empty Upload Dropzone */
                <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center space-y-3 transition-colors bg-slate-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-brand-700">
                        {uploading ? (
                            <div className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6" />
                        )}
                    </div>

                    <div>
                        <div className="text-xs font-bold text-slate-800">
                            {uploading ? 'Compressing & converting to WebP...' : 'Upload Product Photo'}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Auto-compressed, resized, and stripped of excess metadata.
                        </p>
                    </div>

                    {uploading && (
                        <div className="w-full max-w-xs mx-auto space-y-1">
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-brand-700 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">Processing image buffer...</span>
                        </div>
                    )}

                    {!uploading && (
                        <label className="inline-block px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs">
                            Browse Image File
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    )}

                    <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-400 pt-1">
                        <span>Supports JPG, PNG, WebP, AVIF</span>
                        <span>•</span>
                        <span>Auto Aspect Preserved</span>
                    </div>
                </div>
            )}
        </div>
    );
}
