import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../api/axios';

const STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const KanbanColumn = ({ status, orders, onStatusUpdate, loadingId }) => {
    const getIcon = () => {
        switch (status) {
            case 'Pending': return <Package className="w-5 h-5 text-amber-500" />;
            case 'Preparing': return <RefreshCw className="w-5 h-5 text-blue-500" />;
            case 'Out for Delivery': return <Truck className="w-5 h-5 text-purple-500" />;
            case 'Delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return null;
        }
    };

    const getBorderColor = () => {
        switch (status) {
            case 'Pending': return 'border-amber-200';
            case 'Preparing': return 'border-blue-200';
            case 'Out for Delivery': return 'border-purple-200';
            case 'Delivered': return 'border-emerald-200';
            case 'Cancelled': return 'border-red-200';
            default: return 'border-slate-200';
        }
    };

    return (
        <div className="min-w-[320px] max-w-[320px] bg-slate-100/50 rounded-3xl p-4 flex flex-col h-full border border-slate-200">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <h3 className="font-outfit font-bold text-slate-800 text-lg">{status}</h3>
                </div>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">{orders.length}</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pb-4 no-scrollbar flex-1 relative">
                {orders.map(order => (
                    <div
                        key={order._id}
                        className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${getBorderColor()} hover:shadow-md transition-shadow relative`}
                    >
                        {loadingId === order._id && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                                <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">#{order._id.substring(18).toUpperCase()}</span>
                            <span className="text-sm font-bold text-slate-900">₹{order.items.reduce((s, i) => s + i.totalAmount, 49.00 + (order.items.reduce((a, b) => a + b.totalAmount, 0) * 0.08)).toFixed(2)}</span>
                        </div>

                        <p className="font-medium text-slate-800 text-sm mb-1">{order.userId?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-1" title={order.deliveryAddress}>{order.deliveryAddress}</p>

                        <div className="space-y-1 mb-4">
                            {order.items.slice(0, 2).map((item, i) => (
                                <div key={i} className="text-xs text-slate-600 flex justify-between">
                                    <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                                </div>
                            ))}
                            {order.items.length > 2 && (
                                <div className="text-xs text-slate-400 font-medium">+{order.items.length - 2} more items</div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                            {STATUSES.map(s => {
                                const isCurrent = order.status === s;

                                const getIconForStatus = (statusName) => {
                                    switch (statusName) {
                                        case 'Pending': return <Package className="w-4 h-4" />;
                                        case 'Preparing': return <RefreshCw className="w-4 h-4" />;
                                        case 'Out for Delivery': return <Truck className="w-4 h-4" />;
                                        case 'Delivered': return <CheckCircle className="w-4 h-4" />;
                                        case 'Cancelled': return <XCircle className="w-4 h-4" />;
                                        default: return null;
                                    }
                                };

                                const getColorClassForStatus = (statusName) => {
                                    switch (statusName) {
                                        case 'Pending': return 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200';
                                        case 'Preparing': return 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200';
                                        case 'Out for Delivery': return 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200';
                                        case 'Delivered': return 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200';
                                        case 'Cancelled': return 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200';
                                        default: return 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200';
                                    }
                                };

                                return (
                                    <button
                                        key={s}
                                        onClick={() => onStatusUpdate(order._id, s)}
                                        disabled={isCurrent || loadingId === order._id}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isCurrent
                                            ? `${getColorClassForStatus(s)} opacity-100 ring-2 ring-offset-1 ring-${getColorClassForStatus(s).split('-')[1]}-400`
                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 opacity-60 hover:opacity-100'
                                            }`}
                                        title={`Change status to ${s}`}
                                    >
                                        {getIconForStatus(s)}
                                        <span className={isCurrent ? '' : 'hidden xl:inline'}>{s}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-2xl mx-2">
                        No orders in this state
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/admin');
            setOrders(data.data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Connect to Socket.IO server
        const socket = io('http://localhost:5000');

        socket.on('newOrder', (order) => {
            // Unshift new order into the Kanban board
            setOrders(prev => [order, ...prev]);
        });

        socket.on('orderStatusUpdated', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o));
        });

        return () => socket.disconnect();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            // Update local state without full refetch for snappy UX
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Real-time Orders...</div>;

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6 flex justify-between items-end flex-shrink-0 pr-8">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-slate-900 mb-2">Order Management</h1>
                    <p className="text-slate-500">Kanban-style fulfillment tracking system.</p>
                </div>
                <button onClick={fetchOrders} className="p-2.5 bg-white text-slate-500 hover:text-yellow-400 rounded-xl shadow-sm border border-slate-200 transition-colors tooltip relative group">
                    <RefreshCw className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Refresh Board</span>
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-6 h-full items-start">
                    {STATUSES.map((status, index) => (
                        <div key={status} className="animate-slide-up h-full" style={{ animationDelay: `${index * 0.1}s` }}>
                            <KanbanColumn
                                status={status}
                                orders={orders.filter(o => o.status === status)}
                                onStatusUpdate={handleStatusUpdate}
                                loadingId={updatingId}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
