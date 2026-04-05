import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Phone, Loader2, Calendar, MapPin, Briefcase } from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="p-8 text-center bg-red-50 text-red-600 font-bold rounded-3xl">{error}</div>;
    if (!user) return null;

    const ROLE_LABELS: Record<string, string> = {
        admin: 'System Administrator',
        merchant: 'Business Merchant',
        customer: 'Retail Customer',
        courier: 'Logistics Courier',
        warehouse_op: 'Warehouse Operator',
        support: 'Support Agent',
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
                <p className="text-slate-500">Manage your account information and preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-primary/20">
                            <span className="text-4xl font-black text-primary">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-sm font-semibold text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                        </div>
                        <div className="pt-4">
                            <span className={clsx(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                user.role === 'admin' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                            )}>
                                Verified Account
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Fast Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition text-left px-5 flex items-center gap-3">
                                <Shield className="h-4 w-4 text-emerald-400" />
                                Security Settings
                            </button>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition text-left px-5 flex items-center gap-3">
                                <Mail className="h-4 w-4 text-blue-400" />
                                Notifications
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                            <button className="text-primary text-sm font-black uppercase tracking-widest hover:underline">Edit Info</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Full Name</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">{user.name}</div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">{user.email}</div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Phone Number</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">{user.phone || 'Not Provided'}</div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Account Type</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">{ROLE_LABELS[user.role] || user.role}</div>
                            </div>
                        </div>

                        <hr className="border-slate-50" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Member Since</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Primary Hub</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">Kigali Central Office</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100 border-dashed text-amber-900">
                        <div className="flex gap-4">
                            <Shield className="h-10 w-10 text-amber-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-black text-lg mb-1 uppercase tracking-tight">Security Tip</h4>
                                <p className="text-sm font-medium opacity-80 leading-relaxed">
                                    Keep your phone number updated to ensure you receive automated tracking SMS notifications and secure withdrawal alerts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
