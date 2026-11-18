import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, FileText, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductPlaceholder from './ProductPlaceholder';
import QuoteModal from './QuoteModal';
import BuyNowModal from './BuyNowModal';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

    const isQuoteOnly = !product.price || product.price_type === 'quote_only';
    const isFixedPrice = product.price && (product.price_type === 'fixed_price' || product.price_type === 'both');

    return (
        <>
            <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:border-brand-300">
                {/* Image / Placeholder Area */}
                <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-slate-50">
                    <ProductPlaceholder
                        categorySlug={product.category_slug || ''}
                        modelNumber={product.model_number}
                        name={product.name}
                        imageUrl={product.thumbnail_image || product.primary_image}
                        className="h-48 w-full"
                    />

                    {/* Availability Tag */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                        {product.availability === 'in_stock' ? (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>In Stock</span>
                            </span>
                        ) : product.availability === 'on_order' ? (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock className="w-2.5 h-2.5" />
                                <span>On Order</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Inquiry Only
                            </span>
                        )}
                    </div>
                </Link>

                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        {/* Category & Model Bar */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="text-brand-700 font-semibold truncate max-w-[65%]">
                                {product.category_name}
                            </span>
                            {product.model_number && (
                                <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    {product.model_number}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <Link to={`/products/${product.slug}`}>
                            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2 mb-1.5">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                {product.short_description}
                            </p>
                        )}
                    </div>

                    {/* Price and Action Section */}
                    <div className="pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-baseline justify-between mb-3">
                            {isFixedPrice ? (
                                <div>
                                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Price</span>
                                    <div className="text-base font-extrabold text-slate-900">
                                        NPR {parseFloat(product.price).toLocaleString()}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Pricing</span>
                                    <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        Request a Quote
                                    </span>
                                </div>
                            )}

                            <Link
                                to={`/products/${product.slug}`}
                                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center space-x-0.5"
                            >
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            {isQuoteOnly ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => addToCart(product, 1)}
                                        className="w-full py-2 px-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsQuoteOpen(true)}
                                        className="w-full py-2 px-2 text-xs font-bold rounded-xl bg-brand-800 hover:bg-brand-900 text-white transition-colors shadow-xs flex items-center justify-center space-x-1"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Get Quote</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => addToCart(product, 1)}
                                        className="w-full py-2 px-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsBuyNowOpen(true)}
                                        className="w-full py-2 px-2 text-xs font-bold rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 transition-colors shadow-xs flex items-center justify-center space-x-1"
                                    >
                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                        <span>Buy Now</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
        </>
    );
}
