import React, { useState, useEffect, useContext } from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/user');
                setOrders(data.data.orders);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();

            const socket = io('http://localhost:5000');

            socket.on('orderStatusUpdated', (updatedOrder) => {
                // Ensure we only update if the order naturally belongs to them
                if (updatedOrder.userId === user._id || updatedOrder.userId?._id === user._id) {
                    setOrders(prev => prev.map(o => o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o));
                }
            });

            return () => socket.disconnect();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'Preparing': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'Delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center text-center p-4">
                <Package className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-outfit font-bold text-slate-800 mb-2">No active orders</h2>
                <p className="text-slate-500 mb-6">When you place an order, it will appear here.</p>
                <Link to="/" className="text-yellow-400 font-medium hover:underline">Start browsing</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-outfit font-bold text-slate-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order, index) => {
                        const total = order.items.reduce((acc, item) => acc + item.totalAmount, 0) + 49.00 + (order.items.reduce((acc, item) => acc + item.totalAmount, 0) * 0.08);

                        return (
                            <div
                                key={order._id}
                                className="bg-white p-6 sm:p-8 rounded-3xl shadow-soft border border-slate-100 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-6">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Order ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)} shadow-sm`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-medium text-slate-800">{item.name}</span>
                                            </div>
                                            <span className="text-slate-600">₹{item.totalAmount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                                        <span className="max-w-[200px] truncate" title={order.deliveryAddress}>{order.deliveryAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end font-bold font-outfit text-slate-900 text-xl pl-4">
                                        <span>Total:</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;
