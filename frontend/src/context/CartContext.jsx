import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data } = await api.get('/cart');
            setCart(data.data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [token]);

    const addToCart = async (foodId, quantity = 1) => {
        try {
            const { data } = await api.post('/cart/add', { foodId, quantity });
            setCart(data.data.cart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const { data } = await api.delete(`/cart/remove/${foodId}`);
            setCart(data.data.cart);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (foodId, change) => {
        try {
            const { data } = await api.post('/cart/add', { foodId, quantity: change });
            setCart(data.data.cart);
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    const clearCart = () => setCart(null);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
