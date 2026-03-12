import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, MapPin, Loader2, Plus, Minus } from 'lucide-react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
const RESTAURANT_FALLBACK = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800";

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const { cart, addToCart, updateQuantity, loading: cartLoading } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [addingFoodId, setAddingFoodId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resResponse, foodsResponse] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/foods/restaurant/${id}`)
                ]);

                setRestaurant(resResponse.data.data.restaurant);
                setFoods(foodsResponse.data.data.foods);
            } catch (error) {
                console.error('Failed to fetch restaurant details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async (foodId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setAddingFoodId(foodId);
        try {
            await addToCart(foodId, 1);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingFoodId(null);
        }
    };

    const handleUpdateQuantity = async (foodId, change) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setAddingFoodId(foodId);
        try {
            await updateQuantity(foodId, change);
        } catch (err) {
            console.error(err);
        } finally {
            setAddingFoodId(null);
        }
    };

    const getCartQuantity = (foodId) => {
        if (!cart || !cart.items) return 0;
        const item = cart.items.find((i) => i.foodId._id === foodId || i.foodId === foodId);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">Restaurant not found</h2>
                <button onClick={() => navigate('/')} className="text-yellow-400 font-medium hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </div>
        );
    }

    // Group foods by category
    const categories = foods.reduce((acc, food) => {
        if (!acc[food.category]) acc[food.category] = [];
        acc[food.category].push(food);
        return acc;
    }, {});

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Restaurant Header */}
            <div className="h-64 sm:h-80 w-full relative">
                <img
                    src={restaurant.image || RESTAURANT_FALLBACK}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = RESTAURANT_FALLBACK; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 sm:left-10 w-12 h-12 rounded-full glass-card bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 max-w-3xl">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-400 text-[#0f0f0f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-glow">
                            Currently Open
                        </span>
                        <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-soft relative overflow-hidden">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating || 4.5} ({restaurant.ratingCount || 0}+ ratings)
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-outfit font-bold text-white mb-2 animate-slide-up shadow-sm">
                        {restaurant.name}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{restaurant.address}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-10">
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                    {restaurant.description}
                </p>
            </div>

            {/* Menu Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {Object.keys(categories).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-soft">
                        <h3 className="text-2xl font-bold text-slate-400">No menu items available yet</h3>
                    </div>
                ) : (
                    Object.keys(categories).map((category, index) => (
                        <div key={category} className="mb-16 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <h2 className="text-2xl font-outfit font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2 inline-block">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                                {categories[category].map((food) => (
                                    <div key={food._id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-soft border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
                                        <div className="absolute w-1 top-0 bottom-0 left-0 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={food.image || FALLBACK_IMAGE}
                                            alt={food.name}
                                            className="w-32 h-32 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                        />
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-bold font-outfit text-slate-900 pr-2">
                                                        {food.name}
                                                    </h3>
                                                    <span className="font-bold text-yellow-400 text-lg">
                                                        ₹{food.price.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                    Delicious {food.category.toLowerCase()} prepared freshly.
                                                </p>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                                {getCartQuantity(food._id) > 0 ? (
                                                    <div className="flex items-center justify-between w-[120px] bg-white rounded-xl px-2 py-1.5 border border-slate-200 shadow-sm relative z-10">
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleUpdateQuantity(food._id, -1); }}
                                                            disabled={addingFoodId === food._id}
                                                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="font-bold text-slate-700 min-w-[20px] text-center">
                                                            {addingFoodId === food._id ? <Loader2 className="w-4 h-4 animate-spin text-yellow-400" /> : getCartQuantity(food._id)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleUpdateQuantity(food._id, 1); }}
                                                            disabled={addingFoodId === food._id}
                                                            className="p-1 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); handleAddToCart(food._id); }}
                                                        disabled={addingFoodId === food._id || !food.isAvailable}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all relative z-10 ${!food.isAvailable
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            : 'bg-yellow-50 text-yellow-500 hover:bg-yellow-400 hover:text-[#0f0f0f] shadow-soft active:scale-95'
                                                            }`}
                                                    >
                                                        {addingFoodId === food._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <ShoppingBag className="w-4 h-4" />
                                                        )}
                                                        {food.isAvailable ? 'Add to cart' : 'Sold out'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantDetails;
