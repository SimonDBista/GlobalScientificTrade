import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, ShoppingCart, Zap, FileText, CheckCircle2, Clock,
    Shield, Truck, HelpCircle, Share2, Layers, Award
} from 'lucide-react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import ProductPlaceholder from '../components/ui/ProductPlaceholder';
import ProductCard from '../components/ui/ProductCard';
import QuoteModal from '../components/ui/QuoteModal';
import BuyNowModal from '../components/ui/BuyNowModal';
import useSEO from '../hooks/useSEO';

export default function ProductDetail() {
    const { identifier } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        api.getProduct(identifier)
            .then(res => {
                setProduct(res.product);
                setRelated(res.related || []);
                setSelectedImage(res.product.primary_image || null);
            })
            .catch(err => console.error('Failed to load product detail', err))
            .finally(() => setLoading(false));
    }, [identifier]);

    // Per-product SEO & structured data
    useSEO({
        title: product ? `${product.name}${product.model_number ? ' — ' + product.model_number : ''}` : 'Product Details',
        description: product
            ? `${product.short_description || product.description?.substring(0, 155) || product.name + ' — available from Global Scientific Trade Nepal.'}`
            : 'Scientific equipment product details.',
        url: `/products/${identifier}`,
        image: product?.primary_image ? `https://globalscientifictrade.com.np${product.primary_image}` : undefined,
        type: 'product',
        jsonLd: product ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.short_description || product.description || product.name,
            sku: product.sku || product.model_number,
            mpn: product.model_number,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            image: product.primary_image ? `https://globalscientifictrade.com.np${product.primary_image}` : 'https://globalscientifictrade.com.np/logo.jpeg',
            url: `https://globalscientifictrade.com.np/products/${identifier}`,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'NPR',
                price: product.price || undefined,
                priceSpecification: !product.price ? { '@type': 'PriceSpecification', description: 'Request a Quote' } : undefined,
                availability: product.is_available !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                seller: { '@type': 'Organization', name: 'Global Scientific Trade Pvt. Ltd.' }
            }
        } : null
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="w-12 h-12 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
                <p className="text-slate-500 text-sm">The requested product could not be located in our catalog.</p>
                <Link to="/products" className="inline-block px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-semibold">
                    Browse All Products
                </Link>
            </div>
        );
    }

    const isQuoteOnly = !product.price || product.price_type === 'quote_only';
    const isFixedPrice = product.price && (product.price_type === 'fixed_price' || product.price_type === 'both');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <Link to="/" className="hover:text-brand-900">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-brand-900">Catalog</Link>
                <span>/</span>
                <Link to={`/category/${product.category_slug}`} className="hover:text-brand-900 text-brand-700 font-semibold">
                    {product.category_name}
                </Link>
                <span>/</span>
                <span className="text-slate-800 truncate max-w-xs">{product.name}</span>
            </nav>

            {/* Product Overview Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Gallery / Images */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-96 object-contain p-6"
                            />
                        ) : (
                            <ProductPlaceholder
                                categorySlug={product.category_slug || ''}
                                modelNumber={product.model_number}
                                name={product.name}
                                imageUrl={product.primary_image}
                                className="h-96 w-full"
                            />
                        )}

                        {/* Availability Pill */}
                        <div className="absolute top-4 right-4">
                            {product.availability === 'in_stock' ? (
                                <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>In Stock (Kathmandu Hub)</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    <span>Available on Order</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Gallery Thumbnails if multiple images exist */}
                    {product.gallery && product.gallery.length > 0 && (
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                            {product.primary_image && (
                                <button
                                    onClick={() => setSelectedImage(product.primary_image)}
                                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 p-1 ${selectedImage === product.primary_image ? 'border-brand-700 ring-2 ring-brand-200' : 'border-slate-200'}`}
                                >
                                    <img
                                        src={product.thumbnail_image || product.primary_image}
                                        alt="Primary"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-contain"
                                    />
                                </button>
                            )}
                            {product.gallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img.image_url)}
                                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 p-1 ${selectedImage === img.image_url ? 'border-brand-700 ring-2 ring-brand-200' : 'border-slate-200'}`}
                                >
                                    <img
                                        src={img.thumbnail_url || img.image_url}
                                        alt={`Gallery ${idx}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Institutional Trust Badges */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3 text-xs">
                            <Shield className="w-5 h-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="font-bold text-slate-800 block">Verified Authentic</span>
                                <span className="text-slate-500 text-[11px]">Factory calibration included</span>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3 text-xs">
                            <Truck className="w-5 h-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="font-bold text-slate-800 block">Delivery Across Nepal</span>
                                <span className="text-slate-500 text-[11px]">Secure crated dispatch</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Product Details & Buying Actions */}
                <div className="lg:col-span-6 space-y-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                                {product.category_name}
                            </span>
                            {product.brand && (
                                <span className="text-xs text-slate-500 font-medium">
                                    Brand: <strong className="text-slate-700">{product.brand}</strong>
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Model & SKU tags */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                            {product.model_number && (
                                <div className="flex items-center space-x-1 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    <span className="text-slate-400">Model:</span>
                                    <strong className="text-slate-800">{product.model_number}</strong>
                                </div>
                            )}
                            {product.sku && (
                                <div className="flex items-center space-x-1 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    <span className="text-slate-400">SKU:</span>
                                    <strong className="text-slate-800">{product.sku}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        {isFixedPrice ? (
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Standard Unit Price</span>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        NPR {parseFloat(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-slate-500">Excluding VAT / Institutional discounts</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Pricing Policy</span>
                                <div className="text-xl font-bold text-amber-800 flex items-center space-x-2">
                                    <span>Quotation on Request</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Prices for this testing apparatus depend on specific capacity range, optional attachments, and institutional setup parameters.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Short Description */}
                    {product.short_description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {product.short_description}
                        </p>
                    )}

                    {/* Quantity & Actions Bar */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-4">
                            <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
                            <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded font-bold"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-12 text-center text-sm font-bold focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Button Action Rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => addToCart(product, quantity)}
                                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Shopping Cart</span>
                            </button>

                            {isQuoteOnly ? (
                                <button
                                    type="button"
                                    onClick={() => setIsQuoteOpen(true)}
                                    className="w-full py-3.5 px-4 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Request a Quote</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsBuyNowOpen(true)}
                                    className="w-full py-3.5 px-4 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                                >
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span>Buy Now</span>
                                </button>
                            )}
                        </div>

                        {/* Secondary Quote button if fixed price also offers quote */}
                        {isFixedPrice && (
                            <button
                                type="button"
                                onClick={() => setIsQuoteOpen(true)}
                                className="w-full py-2.5 text-xs font-semibold text-brand-800 hover:text-brand-950 hover:bg-brand-50 rounded-xl transition-colors border border-dashed border-brand-300 flex items-center justify-center space-x-1.5"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Need bulk pricing or proforma invoice? Request institutional quote</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS & FULL DESCRIPTION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                        <span>Technical Specifications</span>
                    </h3>

                    {product.specifications && product.specifications.length > 0 ? (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <tbody>
                                    {product.specifications.map((spec, idx) => (
                                        <tr
                                            key={idx}
                                            className={idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'}
                                        >
                                            <td className="py-3 px-4 font-bold text-slate-700 w-1/3 border-b border-slate-200/60">
                                                {spec.spec_name}
                                            </td>
                                            <td className="py-3 px-4 text-slate-800 border-b border-slate-200/60 font-medium">
                                                {spec.spec_value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 mt-4 italic">
                            Standard manufacturing specifications apply. Please contact our technical desk for custom parameters.
                        </p>
                    )}
                </div>

                {/* Full Description */}
                {product.full_description && (
                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-base font-bold text-slate-900 mb-3">Product Description & Application</h4>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-2">
                            {product.full_description}
                        </div>
                    </div>
                )}
            </div>

            {/* RELATED PRODUCTS */}
            {related.length > 0 && (
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">
                            Related Instruments in {product.category_name}
                        </h3>
                        <Link
                            to={`/category/${product.category_slug}`}
                            className="text-xs font-bold text-brand-700 hover:underline"
                        >
                            View Department →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {related.map(rel => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            <QuoteModal
                product={product}
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
            />
            <BuyNowModal
                product={product}
                isOpen={isBuyNowOpen}
                onClose={() => setIsBuyNowOpen(false)}
            />
        </div>
    );
}
