import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, MessageSquare, Clock, ArrowRight, User, Loader2, Trash2, Phone } from 'lucide-react';
import api from '../../../services/api';
import { clsx } from 'clsx';

interface Contact {
    _id: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

const ContactManagement = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts/all');
            setContacts(res.data.data);
        } catch (err: any) {
            console.error('Failed to load contact messages');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        setUpdating(true);
        try {
            await api.patch(`/contacts/${id}/status`, { status });
            await fetchContacts();
        } catch (err: any) {
            alert('Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const selected = contacts.find(c => c._id === selectedId);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'new': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'read': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'replied': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 bg-slate-50 rounded-[40px] overflow-hidden p-6">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white border border-slate-100 flex flex-col p-8 rounded-[36px] shadow-sm">
                <header className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Mail className="h-6 w-6 text-indigo-600" />
                        Inquiries
                    </h2>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-1">General Contact Us</p>
                </header>

                <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {contacts.length === 0 ? (
                        <p className="text-center text-slate-400 py-10 italic">No messages found.</p>
                    ) : (
                        contacts.map(c => (
                            <button 
                                key={c._id}
                                onClick={() => setSelectedId(c._id)}
                                className={clsx(
                                    "w-full text-left p-6 rounded-3xl border transition-all duration-300",
                                    selectedId === c._id ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                                )}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", selectedId === c._id ? "bg-white/10 border-white/20 text-white" : getStatusStyle(c.status))}>
                                        {c.status}
                                    </span>
                                    <span className="text-[10px] font-bold opacity-60">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-bold text-sm truncate uppercase tracking-tight mb-1">{c.subject}</h4>
                                <p className={clsx("text-xs truncate", selectedId === c._id ? "text-slate-400" : "text-slate-400")}>{c.email}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-white flex flex-col shadow-sm rounded-[36px] border border-slate-100 overflow-hidden">
                {selected ? (
                    <div className="flex flex-col h-full">
                        <header className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-xl">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selected.subject}</h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-indigo-600" /> {selected.email}</span>
                                    <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4"><Phone className="h-3.5 w-3.5 text-indigo-600" /> {selected.phone}</span>
                                    <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4"><Clock className="h-3.5 w-3.5" /> {new Date(selected.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {selected.status !== 'replied' && (
                                    <button 
                                        disabled={updating}
                                        onClick={() => handleStatusUpdate(selected._id, 'replied')}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-emerald-100 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" /> Mark Replied
                                    </button>
                                )}
                                {selected.status === 'new' && (
                                    <button 
                                        disabled={updating}
                                        onClick={() => handleStatusUpdate(selected._id, 'read')}
                                        className="bg-amber-50 text-amber-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition border border-amber-100">
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </header>

                        <div className="flex-grow overflow-y-auto p-12 bg-slate-50/30">
                            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative">
                                <MessageSquare className="absolute top-10 right-10 h-12 w-12 text-slate-50" />
                                <div className="relative z-10">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 border-b border-slate-50 pb-4">Customer Message</h5>
                                    <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                        {selected.message}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-12 p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50 italic text-sm text-indigo-600 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 flex-shrink-0" />
                                    <span>Please respond to <span className="font-bold underline">{selected.email}</span></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 flex-shrink-0" />
                                    <span>Call <span className="font-bold underline">{selected.phone}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center animate-pulse">
                            <Mail className="h-10 w-10 opacity-20" />
                        </div>
                        <div className="text-center">
                            <p className="font-black uppercase tracking-[0.4em] text-xs">Awaiting Selection</p>
                            <p className="text-xs font-medium opacity-60 mt-2">Choose a message from the sidebar to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManagement;
