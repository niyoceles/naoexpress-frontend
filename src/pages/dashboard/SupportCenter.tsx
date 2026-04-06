import React, { useState, useEffect } from 'react';
import { Headphones, AlertCircle, Plus, MessageSquare, Clock, CheckCircle2, ChevronRight, Loader2, Package, Search } from 'lucide-react';
import api from '../../services/api';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const SupportCenter = () => {
    const location = useLocation();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewForm, setShowNewForm] = useState(false);
    const [shipments, setShipments] = useState<any[]>([]);

    useEffect(() => {
        fetchComplaints();
        fetchShipments();

        // Check for ?new=true to auto-open the form
        const params = new URLSearchParams(location.search);
        if (params.get('new') === 'true') {
            setShowNewForm(true);
        }
    }, [location]);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/my');
            setComplaints(res.data.data);
        } catch (err) {
            console.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const fetchShipments = async () => {
        try {
            const res = await api.get('/shipments/my');
            setShipments(res.data.data.slice(0, 10)); // Just get last 10 for dropdown
        } catch (err) {
            console.error('Failed to load shipments');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <Clock className="h-5 w-5 text-blue-500" />;
            case 'in_progress': return <MessageSquare className="h-5 w-5 text-amber-500" />;
            case 'resolved': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'closed': return <Package className="h-5 w-5 text-slate-400" />;
            default: return <AlertCircle className="h-5 w-5 text-slate-400" />;
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Support Center</h1>
                    <p className="text-slate-500 font-medium max-w-lg">How can we help you today? Track your existing issues or initiate a new request for assistance.</p>
                </div>
                <button 
                    onClick={() => setShowNewForm(!showNewForm)}
                    className={clsx(
                        "px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition shadow-xl",
                        showNewForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-primary text-white hover:scale-105 shadow-blue-200"
                    )}
                >
                    {showNewForm ? 'Back to Overview' : <><Plus className="h-5 w-5" /> Initiate New Issue</>}
                </button>
            </header>

            {showNewForm ? (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-blue-600 p-8 rounded-t-[40px] text-white">
                        <h2 className="text-2xl font-black mb-2">Tell us what's wrong</h2>
                        <p className="text-blue-100 text-sm opacity-80">Our resolution team typically responds within 2-4 hours during business days.</p>
                    </div>
                    <div className="bg-white p-2 rounded-b-[40px] border border-slate-100 border-t-0 shadow-2xl">
                        <ComplaintForm 
                            onSuccess={() => {
                                setShowNewForm(false);
                                fetchComplaints();
                            }} 
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Active Issues Counter */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute -right-4 -bottom-4 bg-white/5 w-32 h-32 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">System Health</h3>
                           <div className="space-y-4 relative z-10">
                               <div className="flex justify-between items-center text-sm">
                                   <span className="font-bold opacity-60">Avg. Response Time</span>
                                   <span className="font-black text-emerald-400 text-lg">2.4h</span>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                   <span className="font-bold opacity-60">Resolution Rate</span>
                                   <span className="font-black">98.2%</span>
                               </div>
                           </div>
                           <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                               <p className="text-xs text-white/50 leading-relaxed italic">
                                   "Directly reporting issues helps us improve your shipping experience across the entire NAO Global network."
                               </p>
                           </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Quick Links</h3>
                            <nav className="space-y-3">
                                <Link to="/track" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition group">
                                    <span className="font-bold text-slate-700">Tracking Search</span>
                                    <Search className="h-4 w-4 text-slate-400 group-hover:text-primary transition" />
                                </Link>
                                <Link to="/dashboard/shipments" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition group">
                                    <span className="font-bold text-slate-700">My Deliveries</span>
                                    <Package className="h-4 w-4 text-slate-400 group-hover:text-primary transition" />
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Tickets List */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 pl-4">My Tickets</h3>
                        
                        {complaints.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] py-16 flex flex-col items-center justify-center text-center">
                                <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                                    <Headphones className="h-10 w-10 text-slate-300" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">No active issues found</h4>
                                <p className="text-slate-500 max-w-xs mb-8 italic text-sm">Looks like your logistics are running smoothly! Need something? Click "Initiate New Issue" to start.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {complaints.map(c => (
                                    <div key={c._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                                    {getStatusIcon(c.status)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight leading-tight">{c.subject}</h4>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        REF: {c._id.slice(-8).toUpperCase()} • {new Date(c.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                c.status === 'open' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                c.status === 'in_progress' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                c.status === 'resolved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {c.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium pl-14">
                                            {c.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 pl-14">
                                            <div className="flex items-center gap-2">
                                                {c.shipmentId && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500">
                                                        <Package className="h-3 w-3" /> {c.shipmentId.trackingNumber || 'Processing...'}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500">
                                                    <MessageSquare className="h-3 w-3" /> {c.responses?.length || 0} Responses
                                                </div>
                                            </div>
                                            <Link to={`/dashboard/shipments/${c.shipmentId?._id || ''}`} className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Go to Thread <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportCenter;
