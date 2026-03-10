import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const UserLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are rendering the Home page (helps with transparent dark-hero header)
    const isHome = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Clean up
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Header styling adapts based on page and scroll position.
    // Use #0f0f0f (dark charcoal) for the premium dark aesthetic when scrolled on Home.
    const headerBg = isHome
        ? (scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6')
        : 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-slate-200';

    const textColor = isHome ? 'text-white' : 'text-slate-800';
    const linkHoverColor = isHome ? 'hover:text-yellow-400' : 'hover:text-yellow-500';

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            {/* STICKY ADAPTIVE NAVBAR */}
            <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerBg}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link to="/" className={`flex items-center gap-2 ${textColor} transition-colors duration-300`}>
                            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-[#0f0f0f] font-outfit font-black text-xl shadow-lg">
                                Z
                            </div>
                            <span className="font-outfit font-black text-2xl tracking-tight">
                                ZappyEats
                            </span>
                        </Link>

                        <div className={`flex items-center gap-6 ${textColor} transition-colors duration-300`}>
                            <Link to="/cart" className={`relative p-2 transition-colors duration-200 ${linkHoverColor}`}>
                                <ShoppingCart className="w-6 h-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-yellow-400 text-[#0f0f0f] text-xs font-bold flex items-center justify-center rounded-full shadow-md">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/orders"
                                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${isHome ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'} ${textColor}`}
                                        title="View My Orders"
                                    >
                                        <Package className="w-4 h-4" />
                                        <span className="hidden sm:inline">Orders</span>
                                    </Link>
                                    <div className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${isHome ? 'bg-white/10' : 'bg-slate-100'}`}>
                                        <UserIcon className="w-4 h-4" />
                                        <span>{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`p-2 transition-colors rounded-full duration-200 ${linkHoverColor}`}
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className={`font-medium transition-colors duration-200 ${linkHoverColor}`}>
                                        Log in
                                    </Link>
                                    <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-bold px-6 py-2.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 duration-300">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className={`flex-grow ${!isHome ? 'pt-24' : ''}`}>
                <Outlet />
            </main>

            {/* PREMIUM FOOTER */}
            <footer className="bg-[#0f0f0f] text-white pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-[#0f0f0f] font-outfit font-black text-xl">
                                    Z
                                </div>
                                <span className="font-outfit font-black text-2xl tracking-tight">ZappyEats</span>
                            </div>
                            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                                Experience the future of food delivery. Premium quality, lightning-fast speed, and an unforgettable taste in every bite.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-[#0f0f0f] transition-colors cursor-pointer text-[#0f0f0f]">
                                    <span className="font-bold text-sm">IG</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-[#0f0f0f] transition-colors cursor-pointer text-[#0f0f0f]">
                                    <span className="font-bold text-sm">X</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
                        <p>&copy; {new Date().getFullYear()} ZappyEats. All rights reserved.</p>
                        <p className="mt-4 md:mt-0 items-center flex gap-1">Made with <span className="text-yellow-400">♥</span> for food lovers.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;
