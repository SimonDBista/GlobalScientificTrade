import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductPlaceholder from '../components/ui/ProductPlaceholder';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart, subtotal, hasQuoteItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
                <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    You haven't added any scientific instruments or products to your cart yet.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                    <span>Browse Product Catalogs</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Review Your Order & Inquiry
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Review selected instruments before submitting your institutional order.
                    </p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                    {cart.map((item) => {
                        const price = item.price ? parseFloat(item.price) : 0;
                        const itemTotal = price * item.quantity;
                        const isQuoteItem = !item.price || item.price_type === 'quote_only';

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4"
                            >
                                {/* Thumbnail */}
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                                    <ProductPlaceholder
                                        categorySlug={item.category_name || ''}
                                        modelNumber={item.model_number}
                                        name={item.name}
                                        imageUrl={item.primary_image}
                                        className="h-full w-full"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                                        {item.category_name}
                                    </span>
                                    <Link to={`/products/${item.slug}`}>
                                        <h3 className="text-sm font-bold text-slate-900 hover:text-brand-700 truncate">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    {item.model_number && (
                                        <span className="text-xs font-mono text-slate-500">
                                            Model: {item.model_number}
                                        </span>
                                    )}

                                    {/* Price status */}
                                    <div className="mt-1">
                                        {isQuoteItem ? (
                                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                Quote on Request
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-600">
                                                NPR {price.toLocaleString()} each
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center space-x-2 border border-slate-300 rounded-xl p-1 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="w-28 text-right shrink-0">
                                    {!isQuoteItem ? (
                                        <div className="text-sm font-extrabold text-slate-900">
                                            NPR {itemTotal.toLocaleString()}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-bold text-amber-700">
                                            Inquiry Item
                                        </div>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
                                    title="Remove Item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}

                    <div className="pt-2">
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Continue Browsing Products</span>
                        </Link>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                        Order Summary
                    </h3>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-slate-600">
                            <span>Fixed-Price Items Subtotal:</span>
                            <span className="font-bold text-slate-900">
                                NPR {subtotal.toLocaleString()}
                            </span>
                        </div>

                        {hasQuoteItems && (
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 space-y-1">
                                <div className="flex items-center space-x-1.5 font-bold text-xs">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                                    <span>Contains Quote-Requested Items</span>
                                </div>
                                <p className="text-[11px] text-amber-700">
                                    Your order contains items requiring formal institutional quotation. Our Kathmandu technical team will prepare and send proforma pricing upon submission.
                                </p>
                            </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
                            <span className="font-extrabold text-slate-900">Total Fixed Estimated:</span>
                            <span className="text-lg font-extrabold text-brand-900">
                                NPR {subtotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                        <span>Proceed to Order Submission</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5">
                            <Shield className="w-3.5 h-3.5 text-brand-700" />
                            <span>No advance payment needed for submitting order.</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Official VAT invoice and warranty provided.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
