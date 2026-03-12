import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Store, Search, ExternalLink } from 'lucide-react';
import api from '../../api/axios';

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: '',
        address: '',
        rating: 4.5,
        deliveryTime: '20-30 min',
        isActive: true
    });
    const [editId, setEditId] = useState(null);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data.data.restaurants);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/restaurants/${editId}`, formData);
            } else {
                await api.post('/restaurants', formData);
            }
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', image: '', description: '', address: '', rating: 4.5, deliveryTime: '20-30 min', isActive: true });
            fetchRestaurants();
        } catch (error) {
            console.error(error);
            alert('Action failed. Check console for errors.');
        }
    };

    const handleEdit = (restaurant) => {
        setEditId(restaurant._id);
        setFormData({
            name: restaurant.name,
            image: restaurant.image,
            description: restaurant.description,
            address: restaurant.address,
            rating: restaurant.rating || 4.5,
            deliveryTime: restaurant.deliveryTime || '20-30 min',
            isActive: restaurant.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Deleting a restaurant will also delete all its food items. Continue?')) {
            try {
                await api.delete(`/restaurants/${id}`);
                fetchRestaurants();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-slate-900 mb-2">Restaurants Management</h1>
                    <p className="text-slate-500">Manage all registered delivery partners.</p>
                </div>
                <button
                    onClick={() => {
                        setEditId(null);
                        setFormData({ name: '', image: '', description: '', address: '', rating: 4.5, deliveryTime: '20-30 min', isActive: true });
                        setShowModal(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-bold px-4 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Restaurant
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden animate-slide-up">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading restaurants...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Restaurant</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-slate-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {restaurants.map(rest => (
                                <tr key={rest._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={rest.image} alt={rest.name} className="w-12 h-12 rounded-xl object-cover bg-slate-200" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=80"; }} />
                                            <div>
                                                <div className="font-bold text-slate-900 font-outfit">{rest.name}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                                    {rest.address.substring(0, 30)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${rest.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {rest.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/admin/restaurants/${rest._id}/foods`}
                                                className="p-2 bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                                                title="Manage Menu"
                                            >
                                                <Store className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(rest)}
                                                className="p-2 bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rest._id)}
                                                className="p-2 bg-slate-100 text-slate-600 hover:bg-yellow-100 hover:text-yellow-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {restaurants.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                        No restaurants found. Start by adding one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal component */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-slide-up">
                        <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-6">
                            {editId ? 'Edit Restaurant' : 'Add Restaurant'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Pasta Palace" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input required type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="123 Street Name" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <input required type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="4.5" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Time</label>
                                    <input required type="text" value={formData.deliveryTime} onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="20-30 min" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none h-24" placeholder="Brief description..." />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-yellow-400 focus:ring-yellow-400 rounded border-slate-300" />
                                <label htmlFor="isActive" className="text-sm text-slate-700 font-medium">Restaurant is active</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] rounded-xl font-medium transition-colors shadow-soft">Save Restaurant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRestaurants;
