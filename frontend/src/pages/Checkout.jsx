import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!cart || cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    const subtotal = cart.items.reduce((acc, item) => acc + item.totalAmount, 0);
    const total = subtotal + 49.00 + (subtotal * 0.08);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!address) {
            setError('Please provide a delivery address.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            await api.post('/orders', {
                deliveryAddress: address,
                paymentMethod
            });
            clearCart();
            setSuccess(true);
            setTimeout(() => navigate('/orders'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center -mt-10 px-4 animate-fade-in relative overflow-hidden bg-slate-50">
                {/* Confetti Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-20px`,
                            backgroundColor: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 5)],
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1.5 + Math.random() * 1.5}s`,
                            opacity: 0,
                        }}
                    />
                ))}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/50 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-200 mb-8 animate-scale-bounce relative z-10">
                    <CheckCircle className="w-14 h-14" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-outfit font-black text-slate-900 mb-4 text-center z-10 animate-slide-up">
                    Order Completed!
                </h1>
                <p className="text-slate-500 text-lg text-center max-w-md z-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Your delicious meal is on its way. We're redirecting you to track your order...
                </p>

                <div className="mt-12 flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-outfit font-bold text-slate-900 mb-8">Secure Checkout</h1>

                {error && (
                    <div className="bg-yellow-50 border border-yellow-100 text-yellow-500 px-4 py-3 rounded-xl mb-6 shadow-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-soft border border-slate-100">
                    <form onSubmit={handleCheckout} className="space-y-8">

                        {/* Delivery Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-slate-800">
                                <MapPin className="w-6 h-6 text-yellow-400" />
                                <h3 className="text-xl font-bold font-outfit">Delivery Details</h3>
                            </div>
                            <div className="pl-8">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white transition-all outline-none text-slate-900 resize-none h-24"
                                    placeholder="e.g. 123 Main St, Apt 4B, New York, NY 10001"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Payment Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-slate-800">
                                <CreditCard className="w-6 h-6 text-yellow-400" />
                                <h3 className="text-xl font-bold font-outfit">Payment Method</h3>
                            </div>
                            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label
                                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'Online'
                                        ? 'border-yellow-400 bg-yellow-50/50 object-cover shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Online"
                                        className="hidden"
                                        onChange={() => setPaymentMethod('Online')}
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Online' ? 'border-yellow-400' : 'border-slate-300'
                                        }`}>
                                        {paymentMethod === 'Online' && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">Pay Online</div>
                                        <div className="text-xs text-slate-500">Credit Card, Netbanking</div>
                                    </div>
                                </label>

                                <label
                                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'COD'
                                        ? 'border-yellow-400 bg-yellow-50/50 shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        className="hidden"
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-yellow-400' : 'border-slate-300'
                                        }`}>
                                        {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">Cash on Delivery</div>
                                        <div className="text-xs text-slate-500">Pay when it arrives</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl mt-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600">Total to pay:</span>
                                <span className="text-3xl font-bold font-outfit text-slate-900">₹{total.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-slate-400">Includes taxes and ₹49.00 delivery fee.</p>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-medium py-4 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:pointer-events-none"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm Order & Pay
                                        <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
