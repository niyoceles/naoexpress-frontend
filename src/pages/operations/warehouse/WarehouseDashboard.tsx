import React, { useEffect, useState } from 'react';
import { Warehouse, Inbox, Send, Activity, Loader2, Package, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useAuth from '../../../hooks/useAuth';
import { clsx } from 'clsx';

const WarehouseDashboard = () => {
    const { name } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        api.get('/warehouse-ops/analytics')
            .then(res => setData(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    if (loading || !data) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const { stats, incomingQueue, outgoingQueue } = data;

    const kpis = [
        { label: 'At Origin Hub', value: stats.atOriginHub, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'At Dest. Hub', value: stats.atDestHub, icon: Warehouse, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'In Transit', value: stats.inTransit, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Out for Delivery', value: stats.outForDelivery, icon: Send, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    const QueueRow = ({ shipment }: { shipment: any }) => (
        <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                    <div className="font-bold text-slate-900 text-sm">{shipment.trackingNumber}</div>
                    <div className="text-xs text-slate-400">{shipment.sender?.city} → {shipment.receiver?.city} · {shipment.totalWeight}kg</div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {shipment.status?.replace(/_/g, ' ')}
                </span>
                <Link to={`/dashboard/shipments/${shipment._id}`} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition">
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                        {data.isFiltered ? 'My Hub Portal' : 'Warehouse Command Center'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {data.isFiltered ? `Viewing your personal task queue, ${name.split(' ')[0]}.` : `System-wide warehouse management overview.`}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/ops/warehouse/inventory" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-700 font-bold text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" /> Inventory List
                    </Link>
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-500">
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((k, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                        <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm', k.bg)}>
                            <k.icon className={clsx('h-6 w-6', k.color)} />
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{k.value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Incoming */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider text-sm">
                            <Inbox className="h-5 w-5 text-blue-500" /> {data.isFiltered ? 'My Incoming Tasks' : 'Global Incoming Queue'}
                        </h3>
                        <Link to="/ops/warehouse/incoming" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
                    </div>
                    {incomingQueue.length === 0 ? (
                        <div className="p-16 text-center text-slate-400 text-sm font-bold opacity-50">No incoming packages {data.isFiltered ? 'assigned to you' : 'at hub'}.</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {incomingQueue.slice(0, 5).map((s: any) => <QueueRow key={s._id} shipment={s} />)}
                        </div>
                    )}
                </div>

                {/* Outgoing */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider text-sm">
                            <Send className="h-5 w-5 text-green-500" /> {data.isFiltered ? 'My Outgoing Tasks' : 'Global Outgoing Queue'}
                        </h3>
                        <Link to="/ops/warehouse/outgoing" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
                    </div>
                    {outgoingQueue.length === 0 ? (
                        <div className="p-16 text-center text-slate-400 text-sm font-bold opacity-50">No packages {data.isFiltered ? 'assigned to you' : 'queued for dispatch'}.</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {outgoingQueue.slice(0, 5).map((s: any) => <QueueRow key={s._id} shipment={s} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
