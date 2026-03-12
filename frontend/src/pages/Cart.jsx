import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, loading } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 shadow-soft">
                    <ShoppingBag className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">You need to log in</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Please log in to your account to view your cart items and checkout.</p>
                <Link
                    to="/login"
                    className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-xl text-[#0f0f0f] font-medium shadow-soft transition-all"
                >
                    Log in
                </Link>
            </div>
        );
    }

    if (loading && !cart) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading cart...</div>;
    }

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + item.totalAmount, 0);
    const deliveryFee = items.length > 0 ? 49.00 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-yellow-200" />
                </div>
                <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any items to your cart yet.</p>
                <Link
                    to="/"
                    className="bg-slate-900 hover:bg-slate-800 px-8 py-3.5 rounded-xl text-white font-medium shadow-soft transition-all flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-outfit font-bold text-slate-900 mb-8">Review Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.foodId._id}
                                className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center gap-6 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img
                                    src={item.foodId.image || FALLBACK_IMAGE}
                                    alt={item.foodId.name}
                                    className="w-24 h-24 object-cover rounded-2xl shadow-sm"
                                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                />

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold font-outfit text-slate-900 mb-1">{item.foodId.name}</h3>
                                    <div className="flex items-center gap-3 mb-2">
                                        <button
                                            onClick={() => updateQuantity(item.foodId._id, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-slate-700 min-w-[1.25rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.foodId._id, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-yellow-400 font-bold text-lg">₹{item.totalAmount.toFixed(2)}</div>
                                </div>

                                <div className="pl-4 border-l border-slate-100">
                                    <button
                                        onClick={() => removeFromCart(item.foodId._id)}
                                        className="p-3 text-slate-400 hover:bg-yellow-50 hover:text-yellow-400 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-soft border border-slate-100 sticky top-28 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-2xl font-outfit font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>

                            <div className="space-y-4 text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-medium text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes (Estimated)</span>
                                    <span className="font-medium text-slate-900">₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-center">
                                <span className="font-bold text-lg text-slate-900">Total</span>
                                <span className="text-2xl font-bold font-outfit text-yellow-400">₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-bold py-4 rounded-2xl shadow-soft transition-all flex items-center justify-center gap-2 group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
