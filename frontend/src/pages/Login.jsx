import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const loggedInUser = await login(formData.email, formData.password);
            if (loggedInUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-400/10 blur-[100px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/10 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-400 mx-auto flex items-center justify-center text-[#0f0f0f] font-outfit font-black text-3xl shadow-lg mb-6 hover:rotate-12 transition-transform duration-300">
                        A
                    </div>
                    <h1 className="text-3xl font-outfit font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400">Enter your details to access your account.</p>
                </div>

                <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-sm animate-slide-up">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 animate-fade-in border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#0f0f0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all outline-none"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-300">Password</label>
                                <a href="#" className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#0f0f0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#0f0f0f] font-bold py-4 rounded-xl shadow-lg hover:shadow-yellow-400/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-yellow-400 font-bold hover:underline transition-all">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
