import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NaoLogo from '../../components/common/NaoLogo';
import { ArrowLeft, Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import api from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/register', formData);
            const { token, role } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left - Brand */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-16 flex-col justify-between">
                <Link to="/">
                    <NaoLogo showText={true} className="h-10 text-white" />
                </Link>
                <div>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Join the new standard in logistics.</h2>
                    <p className="text-slate-400 max-w-sm">Ship parcels, manage inventory, and track everything in real-time — all from one platform.</p>
                </div>
                <div className="text-sm text-slate-500">&copy; 2024 NAO Express</div>
            </div>

            {/* Right - Form */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-16">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-2 mb-10 transition">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Your Account</h1>
                    <p className="text-slate-500 mb-8">Set up your personal or business shipping account.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input name="name" type="text" required value={formData.name} onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                                    placeholder="you@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Account Type</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary text-sm font-bold">
                                <option value="customer">Personal / Retail Sender</option>
                                <option value="merchant">Business / Merchant Account</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input name="password" type="password" required value={formData.password} onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition shadow-lg shadow-slate-200 mt-4">
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account & Start Shipping'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
