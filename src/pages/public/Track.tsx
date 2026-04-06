import React, { useState } from 'react';
import { Search, Loader2, MapPin, Clock, CheckCircle2, History, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const Track = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [showComplaintForm, setShowComplaintForm] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber) return;
        
        setLoading(true);
        setError('');
        setData(null);
        setShowComplaintForm(false);

        try {
            const response = await api.get(`/track/${trackingNumber}`);
            setData(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Shipment not found. Please verify the tracking number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Real-time Shipment Tracking</h1>
                <p className="text-slate-500">Monitor your cargo's journey in every milestone from pickup to delivery.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 mb-12">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow relative">
                        <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <input 
                            type="text" 
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                            placeholder="Enter Tracking Number (e.g. RX-2024-XXXXXX)" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition min-w-[160px]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Track Now'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-6 bg-red-50 text-red-700 rounded-2xl border-l-4 border-red-500 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-6 w-6" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {data && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Summary Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 text-white p-8 rounded-3xl">
                        <div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">Current Status</span>
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black text-primary capitalize">{data.shipment.status.replace(/_/g, ' ')}</h2>
                                <button 
                                    onClick={() => setShowComplaintForm(!showComplaintForm)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all">
                                    Report Problem
                                </button>
                            </div>
                            <p className="text-slate-400 mt-2 text-sm">Last Update: {new Date(data.events[0]?.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col justify-end md:items-end">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">Origin &rarr; Destination</span>
                            <div className="text-xl font-bold text-right">
                                {data.shipment.sender.city}, {data.shipment.sender.country} &rarr; {data.shipment.receiver.city}, {data.shipment.receiver.country}
                            </div>
                        </div>
                    </div>

                    {showComplaintForm && (
                        <div className="animate-in zoom-in-95 duration-200">
                            <ComplaintForm shipmentId={data.shipment._id} />
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                        <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
                            <History className="h-6 w-6 text-primary" />
                            Activity Logs
                        </h3>
                        
                        <div className="relative space-y-12 ml-4">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                            {data.events.map((event: any, index: number) => (
                                <div key={index} className="relative pl-12">
                                    <div className={clsx(
                                        "absolute left-[-11px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                                        index === 0 ? "bg-primary scale-125" : "bg-slate-300"
                                    )}>
                                        {index === 0 && <CheckCircle2 className="h-3 w-3 text-white" />}
                                    </div>
                                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                                        <div className="max-w-lg">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-extrabold text-slate-900 capitalize">{event.status.replace(/_/g, ' ')}</h4>
                                                <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {event.location}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                                        </div>
                                        <div className="flex flex-col md:items-end flex-shrink-0">
                                            <div className="flex items-center text-sm font-bold text-slate-900 mb-1">
                                                <Clock className="h-4 w-4 mr-2 text-primary" />
                                                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(event.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Track;
