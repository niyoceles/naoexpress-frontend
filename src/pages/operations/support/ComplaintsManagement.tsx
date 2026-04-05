import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, Clock, Send, User, ChevronRight, Loader2, Package } from 'lucide-react';
import api from '../../../services/api';
import { clsx } from 'clsx';

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

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
    priority: 'low' | 'medium' | 'high' | 'urgent';
    userId: UserInfo;
    shipmentId?: { _id: string; trackingNumber: string };
    responses: Response[];
    createdAt: string;
}

const ComplaintsManagement = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/all');
            setComplaints(res.data.data);
        } catch (err: any) {
            console.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId || !reply.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/complaints/${selectedId}/respond`, { message: reply });
            setReply('');
            await fetchComplaints();
        } catch (err: any) {
            alert('Failed to send response.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.patch(`/complaints/${id}/status`, { status });
            await fetchComplaints();
        } catch (err: any) {
            alert('Failed to update status.');
        }
    };

    const selected = complaints.find(c => c._id === selectedId);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'resolved': return 'bg-green-50 text-green-700 border-green-100';
            case 'closed': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-50 text-red-700 border-red-100';
            case 'high': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'medium': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'low': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 bg-slate-50 rounded-[40px] overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
                <header className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-primary" />
                        Complaints Desk
                    </h2>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-1">Resolution Center</p>
                </header>

                <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {complaints.map(c => (
                        <button 
                            key={c._id}
                            onClick={() => setSelectedId(c._id)}
                            className={clsx(
                                "w-full text-left p-5 rounded-3xl border transition-all hover:scale-[1.02]",
                                selectedId === c._id ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                            )}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", selectedId === c._id ? "bg-white/10 border-white/20 text-white" : getStatusStyle(c.status))}>
                                    {c.status.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-bold opacity-60">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">{c.subject}</h4>
                            <p className={clsx("text-xs mt-1 truncate", selectedId === c._id ? "text-slate-400" : "text-slate-400")}>From: {c.userId.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-grow bg-white flex flex-col shadow-sm rounded-r-[40px]">
                {selected ? (
                    <>
                        <header className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-xl">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selected.subject}</h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {selected.userId.name}</span>
                                    <span className="flex items-center gap-1 font-mono uppercase tracking-widest"><AlertCircle className="h-3 w-3" /> {selected.priority} Priority</span>
                                    {selected.shipmentId && (
                                        <span className="text-primary flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                            <Package className="h-3 w-3" /> TRK: {selected.shipmentId.trackingNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleStatusUpdate(selected._id, 'resolved')}
                                    className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition border border-emerald-100">
                                    Mark Resolved
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(selected._id, 'closed')}
                                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition border border-slate-200">
                                    Close Ticket
                                </button>
                            </div>
                        </header>

                        <div className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth">
                            {/* Customer Message */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-blue-200">
                                    {selected.userId.name.charAt(0)}
                                </div>
                                <div className="bg-blue-50 rounded-3xl rounded-tl-none p-6 text-slate-900 max-w-2xl shadow-sm border border-blue-100">
                                    <p className="font-medium whitespace-pre-wrap">{selected.description}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-4 block">Original Complaint • {new Date(selected.createdAt).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            {/* Responses */}
                            {selected.responses.map((res, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-slate-200">
                                        OP
                                    </div>
                                    <div className="bg-slate-50 rounded-3xl rounded-tl-none p-6 text-slate-900 max-w-2xl shadow-sm border border-slate-100">
                                        <p className="font-medium whitespace-pre-wrap">{res.message}</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 block">Operator Response • {new Date(res.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <footer className="p-8 bg-slate-50/50 backdrop-blur-md border-t border-slate-100">
                            <form onSubmit={handleReply} className="flex gap-4 items-end">
                                <div className="flex-grow bg-white p-4 rounded-3xl border border-slate-100 shadow-inner focus-within:ring-2 focus-within:ring-primary transition-all">
                                    <textarea 
                                        rows={1}
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        placeholder="Type your response here..."
                                        className="w-full bg-transparent border-none outline-none text-slate-800 font-medium resize-none"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={submitting || !reply.trim()}
                                    className="bg-primary text-white p-5 rounded-3xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-blue-200 group">
                                    {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center">
                            <MessageSquare className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="font-black uppercase tracking-[0.2em] text-xs">Select a ticket to begin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintsManagement;
