import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const AdminFoods = () => {
    const { id: restaurantId } = useParams();
    const [foods, setFoods] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        price: '',
        category: '',
        isAvailable: true
    });
    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        try {
            const [resReq, foodReq] = await Promise.all([
                api.get(`/restaurants/${restaurantId}`),
                api.get(`/foods/restaurant/${restaurantId}`)
            ]);
            setRestaurant(resReq.data.data.restaurant);
            setFoods(foodReq.data.data.foods);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, price: Number(formData.price) };
            if (editId) {
                await api.put(`/foods/${editId}`, payload);
            } else {
                await api.post(`/foods/restaurant/${restaurantId}`, payload);
            }
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', image: '', price: '', category: '', isAvailable: true });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Action failed. Check console.');
        }
    };

    const handleEdit = (food) => {
        setEditId(food._id);
        setFormData({
            name: food.name,
            image: food.image,
            price: food.price.toString(),
            category: food.category,
            isAvailable: food.isAvailable
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await api.delete(`/foods/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading menu configuration...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/restaurants" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-yellow-400 transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Restaurants
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-outfit font-bold text-slate-900 mb-2">Menu configuration</h1>
                        <p className="text-slate-500 text-lg">Managing items for <span className="font-bold text-yellow-400">{restaurant?.name}</span></p>
                    </div>
                    <button
                        onClick={() => {
                            setEditId(null);
                            setFormData({ name: '', image: '', price: '', category: '', isAvailable: true });
                            setShowModal(true);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-bold px-4 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Food Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                {foods.map((food, index) => (
                    <div key={food._id} className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex gap-4 relative group" style={{ animationDelay: `${index * 0.05}s` }}>
                        <img
                            src={food.image}
                            alt={food.name}
                            className="w-24 h-24 object-cover rounded-xl bg-slate-100"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"; }}
                        />
                        <div className="flex-1">
                            <h3 className="font-bold font-outfit text-slate-900 leading-tight mb-1">{food.name}</h3>
                            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block mb-1">{food.category}</div>
                            <div className="font-bold text-yellow-400 text-lg">₹{food.price.toFixed(2)}</div>
                        </div>

                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(food)} className="p-1.5 bg-white shadow-soft rounded-lg text-slate-400 hover:text-blue-500 border border-slate-100">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(food._id)} className="p-1.5 bg-white shadow-soft rounded-lg text-slate-400 hover:text-yellow-400 border border-slate-100">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {!food.isAvailable && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">Sold Out</span>
                            </div>
                        )}

                        {/* Always keep edit buttons above the disabled overlay */}
                        {!food.isAvailable && (
                            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 transition-opacity hover:opacity-100 opacity-50">
                                <button onClick={() => handleEdit(food)} className="p-1.5 bg-white shadow-soft rounded-lg text-slate-800 hover:text-blue-500 border border-slate-200">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(food._id)} className="p-1.5 bg-white shadow-soft rounded-lg text-slate-800 hover:text-yellow-400 border border-slate-200">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {foods.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-3xl border border-slate-100 border-dashed">
                        <div className="text-slate-400 mb-2">No menu items configured for this restaurant.</div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-scale-up">
                        <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-6">
                            {editId ? 'Edit Item' : 'Add Menu Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Truffle Burger" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                                    <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="149.00" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Mains, Sides..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input required type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="https://..." />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isAvailable" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} className="w-4 h-4 text-yellow-400 box-content rounded border-slate-300" />
                                <label htmlFor="isAvailable" className="text-sm text-slate-700 font-medium">Currently Available in Stock</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] rounded-xl font-bold transition-colors shadow-soft">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFoods;
