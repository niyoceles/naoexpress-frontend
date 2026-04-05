import React, { useEffect, useState } from 'react';
import { Headphones, Package, Truck, CheckCircle2, XCircle, Loader2, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useAuth from '../../../hooks/useAuth';
import { clsx } from 'clsx';

const SupportDashboard = () => {
    const { name } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/support/dashboard')
            .then(res => setData(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">System Status</h2>
                    <div className="prose prose-sm text-slate-600">
                        <h3>🏭 Global Multi-Hub Network</h3>
                        <ul>
                            <li><strong>Kigali Hub (RW)</strong>: The primary logistics node for Rwanda.</li>
                            <li><strong>Europe Gateway (NL)</strong>: Amsterdam-based hub for international transit.</li>
                            <li><strong>China Fulfillment (CN)</strong>: Guangzhou-based manufacturing and export center.</li>
                        </ul>
                        <h3>📈 Historical Analytics</h3>
                        <p>Shipping volume data includes 6 months of historical records to populate growth charts and trend analysis.</p>
                    </div>
                </div>
                <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            </div>
        );
    }

    const { stats, recentActivity } = data;

    const kpis = [
        { label: 'Total Shipments', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Failed', value: stats.failed, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Support Centre</h1>
                    <p className="text-slate-500">Welcome, {name.split(' ')[0]}. Here's the live system overview.</p>
                </div>
                <Link to="/ops/support/search" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                    <Headphones className="h-4 w-4" /> Search Shipment
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

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-slate-900">Live Activity Feed</h3>
                </div>
                {recentActivity.length === 0 ? (
                    <div className="p-16 text-center text-slate-400">No recent activity.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {recentActivity.map((event: any, i: number) => (
                            <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">
                                            {event.shipmentId?.trackingNumber || 'Unknown'} — {event.status?.replace(/_/g, ' ')}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5">
                                            {event.description} · by {event.actor?.name || 'System'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono whitespace-nowrap">
                                    <Clock className="h-3 w-3" />
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportDashboard;
