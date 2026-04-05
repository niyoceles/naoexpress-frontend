import React, { useEffect, useState } from 'react';
import { Send, ArrowRight, Loader2, RefreshCw, UserPlus, User, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useAuth from '../../../hooks/useAuth';
import { clsx } from 'clsx';

const OutgoingQueue = () => {
    const { role } = useAuth();
    const isAdmin = role === 'admin';
    
    const [items, setItems] = useState<any[]>([]);
    const [operatives, setOperatives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, usersRes] = await Promise.all([
                api.get('/warehouse-ops/analytics'),
                isAdmin ? api.get('/admin/users?role=courier') : Promise.resolve({ data: { data: [] } })
            ]);
            setItems(analyticsRes.data.data.outgoingQueue);
            setOperatives(usersRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAssign = async (shipmentId: string, userId: string) => {
        try {
            await api.patch(`/warehouse-ops/${shipmentId}/assign`, { assignedTo: userId });
            setAssigningId(null);
            fetchData();
        } catch (err) {
            alert('Failed to assign shipment');
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Outgoing Dispatch</h1>
                    <p className="text-slate-500 font-medium">Packages ready for final courier handover and last-mile delivery.</p>
                </div>
                <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition shadow-sm text-slate-500">
                    <RefreshCw className="h-5 w-5" />
                </button>
            </header>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="overflow-x-auto text-nowrap">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Track-ID</th>
                                <th className="px-10 py-6">Destination Hub</th>
                                <th className="px-10 py-6">Delivery Target</th>
                                <th className="px-10 py-6">Assigned Carrier</th>
                                <th className="px-10 py-6 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Send className="h-12 w-12" />
                                            <p className="font-black uppercase tracking-widest text-xs">Queue is empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map((s: any) => (
                                <tr key={s._id} className="hover:bg-slate-50/50 transition duration-300">
                                    <td className="px-10 py-7">
                                        <div className="font-extrabold text-slate-900 text-lg">{s.trackingNumber}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                {s.status?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-bold text-slate-700 text-sm whitespace-nowrap">{s.receiver?.city}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.receiver?.country}</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-bold text-slate-900 text-sm">{s.receiver?.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">{s.receiver?.address}</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        {isAdmin ? (
                                            assigningId === s._id ? (
                                                <select 
                                                    autoFocus
                                                    className="bg-slate-100 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-primary w-48"
                                                    onChange={(e) => handleAssign(s._id, e.target.value)}
                                                    onBlur={() => setAssigningId(null)}
                                                >
                                                    <option value="">Select Courier...</option>
                                                    {operatives.map(op => (
                                                        <option key={op._id} value={op._id}>{op.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <button 
                                                    onClick={() => setAssigningId(s._id)}
                                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl transition"
                                                >
                                                    {s.assignedTo ? (
                                                        <>
                                                            <Truck className="h-3.5 w-3.5" />
                                                            {s.assignedTo.name}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="h-3.5 w-3.5" />
                                                            Assign Courier
                                                        </>
                                                    )}
                                                </button>
                                            )
                                        ) : (
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <Truck className="h-3.5 w-3.5 opacity-50" />
                                                {s.assignedTo?.name || 'Unassigned'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <Link to={`/dashboard/shipments/${s._id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-emerald-900/10">
                                            Dispatch <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OutgoingQueue;
