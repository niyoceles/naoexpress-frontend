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
            <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full -z-1 bg-gradient-to-br from-blue-900 to-transparent opacity-40"></div>
                
                <Link to="/" className="mb-8 relative z-10">
                    <NaoLogo showText={true} className="h-10 text-white" />
                </Link>

                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold mb-6 leading-tight">Scale your logistics with the modern standard.</h2>
                    <p className="text-slate-400 max-w-sm mb-12">Join thousands of businesses already using NAO Express for their global supply chain management.</p>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    &copy; 2024 NAO Express Technologies.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-16 lg:p-24 bg-slate-50 md:bg-white">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-2 mb-12 transition">
                        <ArrowLeft className="h-4 w-4" />
                        Back to homepage
                    </Link>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back.</h1>
                    <p className="text-slate-500 mb-10">Access your dashboard and manage shipments.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com" 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 md:bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 md:bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition shadow-lg shadow-slate-200"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
