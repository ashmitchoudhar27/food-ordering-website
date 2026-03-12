import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, TrendingUp, Users, ArrowRight, Eye, X } from 'lucide-react';
import api from '../../api/axios';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <div
        className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between animate-slide-up"
        style={{ animationDelay: `${delay}s` }}
    >
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-outfit font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
            <Icon className="w-7 h-7" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        restaurants: 0,
        orders: 0,
        revenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resResponse, ordersResponse] = await Promise.all([
                    api.get('/restaurants'),
                    api.get('/orders/admin')
                ]);

                const restaurants = resResponse.data.data.restaurants;
                const allOrders = ordersResponse.data.data.orders;

                const totalRevenue = allOrders.reduce((acc, order) => {
                    if (order.status !== 'Cancelled') {
                        const orderTotal = order.items.reduce((sum, item) => sum + item.totalAmount, 0);
                        return acc + orderTotal + 49.00 + (orderTotal * 0.08); // Include logic from frontend calc
                    }
                    return acc;
                }, 0);

                setStats({
                    restaurants: restaurants.length,
                    orders: allOrders.length,
                    revenue: totalRevenue,
                    recentOrders: allOrders.slice(0, 5) // Last 5 orders
                });
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="animate-pulse bg-slate-200 h-96 rounded-3xl w-full" />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Total Restaurants"
                    value={stats.restaurants}
                    icon={Store}
                    colorClass="bg-blue-50 text-blue-500"
                    delay={0.1}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={Package}
                    colorClass="bg-emerald-50 text-emerald-500"
                    delay={0.2}
                />
                <StatCard
                    title="Platform Revenue"
                    value={`₹${stats.revenue.toFixed(2)}`}
                    icon={TrendingUp}
                    colorClass="bg-yellow-50 text-yellow-400"
                    delay={0.3}
                />
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-outfit font-bold text-slate-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm font-medium text-yellow-400 hover:text-yellow-500 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Order ID</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Customer</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Amount</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentOrders.map((order) => {
                                const total = order.items.reduce((acc, item) => acc + item.totalAmount, 0) + 49.00 + (order.items.reduce((acc, item) => acc + item.totalAmount, 0) * 0.08);

                                return (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {order.userId?.name || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            ₹{total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="inline-flex items-center justify-center p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors border border-slate-200 tooltip relative group"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">View Order</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        No orders have been placed yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-scale-up border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-outfit text-slate-900">
                                Order Details
                            </h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Order ID</p>
                                    <p className="font-bold text-slate-900">#{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500 font-medium">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-1 ${selectedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                        selectedOrder.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Customer & Delivery</h3>
                                <p className="font-medium text-slate-700 text-sm mb-1">{selectedOrder.userId?.name || 'Unknown User'}</p>
                                <p className="text-slate-500 text-sm">{selectedOrder.deliveryAddress || 'No address provided'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Order Items</h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{item.quantity}x</span>
                                                <span className="font-medium text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">₹{item.totalAmount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{selectedOrder.items.reduce((acc, item) => acc + item.totalAmount, 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Delivery Fee</span>
                                    <span>₹49.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Tax (8%)</span>
                                    <span>₹{(selectedOrder.items.reduce((acc, item) => acc + item.totalAmount, 0) * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold">
                                    <span className="text-slate-900">Total</span>
                                    <span className="text-yellow-500 text-lg">₹{(selectedOrder.items.reduce((acc, item) => acc + item.totalAmount, 0) + 49.00 + (selectedOrder.items.reduce((acc, item) => acc + item.totalAmount, 0) * 0.08)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
