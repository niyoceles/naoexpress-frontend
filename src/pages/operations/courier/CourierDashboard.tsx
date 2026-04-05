import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle2, XCircle, Clock, Loader2, Package, MapPin, DollarSign, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useAuth from '../../../hooks/useAuth';
import { clsx } from 'clsx';

const STATUS_COLORS: Record<string, string> = {
    out_for_delivery: 'bg-amber-50 text-amber-700 border-amber-200',
    delivered:        'bg-green-50 text-green-700 border-green-200',
    delivery_failed:  'bg-red-50 text-red-700 border-red-200',
    pickup_scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
};

const CourierDashboard = () => {
    const { name } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/courier/analytics')
            .then(res => setData(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const { stats, activeDeliveries } = data;

    const kpis = [
        { label: 'Out for Delivery', value: stats.outForDelivery, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Failed Attempts', value: stats.failedToday, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Pending Pickup', value: stats.pendingPickup, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Good morning, {name.split(' ')[0]}.</h1>
                    <p className="text-slate-500">Your delivery assignments for today.</p>
                </div>
                <Link to="/ops/courier/deliveries" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                    <Truck className="h-4 w-4" /> Active Deliveries
                </Link>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((k, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-md transition">
                        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center mb-4', k.bg)}>
                            <k.icon className={clsx('h-5 w-5', k.color)} />
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{k.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Active Deliveries Quick View */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Active Delivery Queue</h3>
                    <Link to="/ops/courier/deliveries" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        View All <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                {activeDeliveries.length === 0 ? (
                    <div className="p-16 text-center text-slate-400">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-400" />
                        <p className="font-bold">All deliveries complete!</p>
                        <p className="text-sm">No shipments currently out for delivery.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {activeDeliveries.slice(0, 5).map((s: any) => (
                            <div key={s._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{s.trackingNumber}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            {s.receiver?.city}, {s.receiver?.country}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {s.paymentType === 'cod' && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full border border-amber-200">
                                            <DollarSign className="h-3 w-3" /> COD ${s.codAmount}
                                        </span>
                                    )}
                                    <Link to={`/dashboard/shipments/${s._id}`} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition">
                                        Open
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourierDashboard;
