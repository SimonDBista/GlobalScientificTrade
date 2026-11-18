import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('gst_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('gst_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to storage', e);
        }
    }, [cart]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const addToCart = (product, quantity = 1) => {
        const qty = Math.max(1, parseInt(quantity) || 1);
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += qty;
                return updated;
            } else {
                return [...prev, {
                    id: product.id,
                    product_id: product.id,
                    name: product.name,
                    slug: product.slug,
                    model_number: product.model_number,
                    sku: product.sku,
                    price: product.price,
                    price_type: product.price_type || (product.price ? 'fixed_price' : 'quote_only'),
                    primary_image: product.primary_image,
                    category_name: product.category_name,
                    quantity: qty
                }];
            }
        });
        showToast(`Added "${product.name}" to cart`);
    };

    const updateQuantity = (productId, quantity) => {
        const qty = parseInt(quantity);
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: qty } : item));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cart.reduce((sum, item) => {
        if (item.price && !isNaN(item.price)) {
            return sum + (parseFloat(item.price) * item.quantity);
        }
        return sum;
    }, 0);

    const hasQuoteItems = cart.some(item => !item.price || item.price_type === 'quote_only');

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            itemCount,
            subtotal,
            hasQuoteItems,
            toastMessage
        }}>
            {children}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-brand-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-brand-700 animate-bounce">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-400"></span>
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
