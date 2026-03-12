import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Store, Star, Clock, ArrowRight, TrendingUp, Zap, ShieldCheck, X } from 'lucide-react';
import api from '../api/axios';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
const HERO_IMAGE = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000";

const CATEGORIES = [
    { id: 1, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', desc: 'Wood-fired & classic' },
    { id: 2, name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', desc: 'Juicy patties & buns' },
    { id: 3, name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', desc: 'Fresh rolls & sashimi' },
    { id: 4, name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', desc: 'Salads & vegan' }
];

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('Recommended');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                // Pass the selected category to the backend
                const url = selectedCategory === 'All'
                    ? '/restaurants'
                    : `/restaurants?category=${encodeURIComponent(selectedCategory)}`;

                const { data } = await api.get(url);
                setRestaurants(data.data.restaurants);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, [selectedCategory]);

    const sortedRestaurants = [...restaurants]
        .filter(
            (restaurant) =>
                restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                restaurant.isActive
        )
        .sort((a, b) => {
            if (filterOption === 'Highest Rated') {
                return (b.rating || 4.5) - (a.rating || 4.5);
            } else if (filterOption === 'Fastest Delivery') {
                const getMin = (timeStr) => {
                    const match = timeStr?.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 999;
                };
                return getMin(a.deliveryTime) - getMin(b.deliveryTime);
            }
            return 0; // Recommended
        });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (categoryName) => {
        // Toggle off if same category is clicked, otherwise set new
        setSelectedCategory(prev => prev === categoryName ? 'All' : categoryName);
        document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* HERO SECTION */}
            <section className="relative bg-[#0f0f0f] pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-yellow-400 text-sm font-bold mb-6 animate-fade-in">
                                <Zap className="w-4 h-4" />
                                <span>Lightning Fast Delivery</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-outfit font-black text-white leading-[1.1] mb-6 tracking-tight animate-slide-up">
                                Premium food,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                                    delivered fast.
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-xl animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
                                Indulge in culinary masterpieces from top-rated local restaurants. Experience the new standard of food delivery.
                            </p>

                            <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl">
                                    <div className="pl-4 text-slate-400">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full py-3 px-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
                                        placeholder="Search by restaurant name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] p-3 md:px-6 md:py-3 rounded-full font-bold transition-all flex items-center justify-center min-w-[48px] shadow-lg"
                                    >
                                        <span className="hidden md:inline mr-2">Search</span>
                                        <Search className="w-5 h-5 md:hidden" />
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 flex items-center gap-4 text-white/60 text-sm font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                <span>Popular:</span>
                                <div className="flex gap-3">
                                    <span className="cursor-pointer hover:text-yellow-400 transition-colors">Sushi</span>
                                    <span className="cursor-pointer hover:text-yellow-400 transition-colors">Burgers</span>
                                    <span className="cursor-pointer hover:text-yellow-400 transition-colors">Vegan</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative animate-fade-in flex justify-center lg:justify-end">
                            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-full animate-float blur-2xl"></div>
                                <img
                                    src={HERO_IMAGE}
                                    alt="Delicious Food"
                                    className="w-full h-full object-cover rounded-full shadow-[0_0_40px_rgba(250,204,21,0.2)] border-8 border-[#1a1a1a] animate-float relative z-10 hover:scale-105 transition-transform duration-700"
                                    style={{ animationDuration: '6s' }}
                                />
                                {/* Small floating badge */}
                                <div className="absolute bottom-10 -left-6 bg-white rounded-2xl p-4 shadow-xl z-20 flex items-center gap-4 animate-float hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: '1s' }}>
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top Rated</p>
                                        <p className="font-outfit font-black text-slate-900">100% Quality</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curved SVG Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 transform translate-y-[1px]">
                    <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.4,192.27,110.14Z" className="fill-white"></path>
                    </svg>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section className="bg-white py-20 relative z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2">Top Foods</p>
                        <h2 className="text-4xl md:text-5xl font-outfit font-black text-slate-900 mb-6">Our Categories</h2>

                        {selectedCategory !== 'All' && (
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-bold transition-colors"
                            >
                                <X className="w-4 h-4" /> Clear Filter: {selectedCategory}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {CATEGORIES.map((cat) => {
                            const isActive = selectedCategory === cat.name;
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className={`group relative rounded-[2rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 cursor-pointer overflow-hidden text-center border-2 ${isActive ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}
                                >
                                    <div className={`absolute inset-0 transition-opacity duration-300 z-10 ${isActive ? 'bg-transparent' : 'bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100'}`}></div>
                                    <div className="w-32 h-32 mx-auto rounded-full p-2 bg-yellow-50 mb-6 group-hover:scale-110 transition-transform duration-500 relative z-20">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full shadow-md" />
                                    </div>
                                    <h3 className={`text-2xl font-outfit font-bold mb-2 relative z-20 transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-900 group-hover:text-white'}`}>{cat.name}</h3>
                                    <p className={`text-sm relative z-20 transition-colors duration-300 ${isActive ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-200'}`}>{cat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* POPULAR RESTAURANTS */}
            <section id="restaurants-section" className="bg-slate-50 py-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <p className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2">Featured</p>
                            <h2 className="text-4xl md:text-5xl font-outfit font-black text-slate-900 flex items-center gap-4">
                                Popular Restaurants <TrendingUp className="w-10 h-10 text-yellow-400" />
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Filter by:</span>
                            <select
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition-all text-sm"
                            >
                                <option>Recommended</option>
                                <option>Fastest Delivery</option>
                                <option>Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse bg-white rounded-3xl h-96 shadow-sm border border-slate-100" />
                            ))}
                        </div>
                    ) : sortedRestaurants.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Store className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-outfit font-bold text-slate-900 mb-2">No restaurants found</h3>
                            <p className="text-slate-500">We couldn't find any restaurants matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedRestaurants.map((restaurant) => (
                                <Link
                                    to={`/restaurant/${restaurant._id}`}
                                    key={restaurant._id}
                                    className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col border border-slate-100/50"
                                >
                                    <div className="relative h-64 overflow-hidden bg-slate-200">
                                        <img
                                            src={restaurant.image || FALLBACK_IMAGE}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold text-sm text-slate-900">{restaurant.rating || 4.5}</span>
                                                <span className="text-slate-500 text-xs">({restaurant.ratingCount || 0}+)</span>
                                            </div>
                                            <div className="bg-yellow-400 text-[#0f0f0f] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg font-bold text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span>{restaurant.deliveryTime || '20-30 min'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-2xl font-outfit font-black text-slate-900 group-hover:text-yellow-500 transition-colors">
                                                {restaurant.name}
                                            </h3>
                                        </div>

                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {restaurant.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">Featured</span>
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">Free Delivery</span>
                                        </div>

                                        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between group-hover:border-yellow-100 transition-colors">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <MapPin className="w-4 h-4 text-yellow-400" />
                                                <span className="truncate max-w-[150px]">{restaurant.address}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-[#0f0f0f] transition-colors text-slate-400 shadow-sm">
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
