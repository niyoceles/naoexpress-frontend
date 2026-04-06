import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NaoLogo from '../../components/common/NaoLogo';
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import api from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, name } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name || 'User');
            
            // Redirect based on role — each role has its own isolated portal
            if (role === 'admin') navigate('/admin');
            else if (role === 'courier') navigate('/ops/courier');
            else if (role === 'warehouse_op') navigate('/ops/warehouse');
            else if (role === 'support') navigate('/ops/support');
            else navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Side - Visual */}
            <div className="hidden md:flex md:w-1/2 bg-primary text-white p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full -z-1 bg-gradient-to-br from-black/20 to-transparent opacity-40"></div>
                
                <Link to="/" className="mb-8 relative z-10 transition-opacity hover:opacity-90">
                    <NaoLogo className="h-16" />
                </Link>

                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest rounded mb-6">
                        Logistics Powered by Intelligence
                    </span>
                    <h2 className="text-5xl font-black mb-8 leading-[1.1] tracking-tight">Move better. <br/>Scale faster.</h2>
                    <p className="text-blue-100/60 max-w-sm mb-12 font-medium">Join the thousands of businesses optimizing their global supply chain with NAO Express.</p>
                </div>

                <div className="relative z-10 text-[10px] font-black uppercase tracking-widest text-blue-100/30">
                    &copy; 2024 NAO Express Technologies.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-16 lg:p-24 bg-slate-50 md:bg-white">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary gap-2 mb-12 transition group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to homepage
                    </Link>

                    <h1 className="text-4xl font-black text-primary mb-3 tracking-tight">Welcome Back.</h1>
                    <p className="text-slate-500 mb-10 font-medium">Access your dashboard and manage shipments.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com" 
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 md:bg-white rounded-2xl border-2 border-slate-100 outline-none focus:border-accent-orange transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-700 tracking-tight">Password</label>
                                <a href="#" className="text-xs font-black text-accent-orange hover:brightness-90 transition-all uppercase tracking-widest">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 md:bg-white rounded-2xl border-2 border-slate-100 outline-none focus:border-accent-orange transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-accent-orange text-white py-5 rounded-2xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 transition-all shadow-xl shadow-orange-100 hover:shadow-orange-200 active:scale-95 transform"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-sm text-slate-500 font-medium">
                        Don't have an account? <Link to="/register" className="font-black text-accent-orange hover:brightness-90 uppercase tracking-widest ml-1">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Login;
