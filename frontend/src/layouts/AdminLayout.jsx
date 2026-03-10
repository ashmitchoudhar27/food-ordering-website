import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Coffee, ChevronRight, LogOut, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mb-6">
                    <LogOut className="w-10 h-10 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-outfit font-bold text-white mb-4">Access Denied</h2>
                <p className="text-slate-400 mb-8 max-w-sm">You do not have administrative privileges to view this portal.</p>
                <Link
                    to="/"
                    className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-xl text-[#0f0f0f] font-bold shadow-lg transition-all"
                >
                    Return to App
                </Link>
            </div>
        );
    }

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Restaurants', path: '/admin/restaurants', icon: Store },
        { name: 'Orders', path: '/admin/orders', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f0f0f] text-white flex flex-col fixed h-full z-20">
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-[#0f0f0f] font-outfit font-bold text-sm shadow-md">
                            A
                        </div>
                        <span className="font-outfit font-bold text-xl tracking-tight text-white">Admin Portal</span>
                    </div>
                </div>

                <nav className="flex-grow py-6 px-4 space-y-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-yellow-400 text-[#0f0f0f] shadow-md font-bold'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">{link.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className="font-bold text-sm uppercase text-white">{user.name.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors text-sm font-bold"
                    >
                        <LogOut className="w-4 h-4" /> Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[120px] pointer-events-none opacity-50 z-0" />

                <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-outfit font-black text-slate-900">
                        {navLinks.find(link => location.pathname.startsWith(link.path))?.name || 'Admin'}
                    </h1>
                </header>

                <div className="flex-1 p-8 relative z-10 overflow-y-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
