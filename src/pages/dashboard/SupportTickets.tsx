import React, { useState, useEffect } from 'react';
import { AlertCircle, MessageSquare, Clock, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';

interface Response {
    user: string;
    message: string;
    timestamp: string;
}

interface Complaint {
    _id: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: string;
    createdAt: string;
    shipmentId?: { trackingNumber: string };
    responses: Response[];
}

const SupportTickets = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints/my');
                setComplaints(res.data.data);
            } catch (err: any) {
                setError('Failed to load support tickets.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'resolved': return 'bg-green-50 text-green-700 border-green-100';
            case 'closed': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Support Tickets</h1>
                <p className="text-slate-500 font-medium">Track and manage your reported issues.</p>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold">
                    {error}
                </div>
            )}

            {complaints.length === 0 ? (
                <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <MessageSquare className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No tickets found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">You haven't reported any issues yet. If you have a problem with a shipment, report it from the shipment details page.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {complaints.map(ticket => (
                        <div key={ticket._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-slate-900">{ticket.subject}</h3>
                                        <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", getStatusStyle(ticket.status))}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-1">{ticket.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center justify-end gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </div>
                                    {ticket.shipmentId && (
                                        <div className="text-xs font-bold text-primary">
                                            Shipment: {ticket.shipmentId.trackingNumber}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {ticket.responses.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 tracking-widest">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Agent Response Received
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
