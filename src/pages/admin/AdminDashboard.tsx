import React, { useEffect, useState } from 'react';
import {
    Package, Users, TrendingUp, Truck, CheckCircle2, XCircle,
    Clock, BarChart3, ArrowUpRight, Loader2, PlusCircle, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { clsx } from 'clsx';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/admin/analytics/overview');
                setMetrics(res.data.data);
            } catch (error) {
                console.error("Failed to fetch Admin metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const kpiCards = [
        { label: 'Total Shipments', value: metrics.shipments.total.toLocaleString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8.2%' },
        { label: 'Delivered', value: metrics.shipments.delivered.toLocaleString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: '+12.5%' },
        { label: 'In Transit', value: metrics.shipments.inTransit, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+3.1%' },
        { label: 'Failed Deliveries', value: metrics.shipments.failed, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', trend: '-2.0%' },
        { label: 'Registered Users', value: metrics.users.total.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+15%' },
        { label: 'Est. Revenue', value: `$${metrics.estimatedRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+6.4%' },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                        Operations Overview
                    </h1>
                    <p className="text-slate-500">
                        Delivery success rate: <span className="font-bold text-slate-900">{metrics.deliverySuccessRate}%</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    All Systems Operational
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', card.bg)}>
                                <card.icon className={clsx('h-6 w-6', card.color)} />
                            </div>
                            <span className={clsx(
                                'text-xs font-bold flex items-center gap-1',
                                card.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'
                            )}>
                                <ArrowUpRight className="h-3 w-3" />
                                {card.trend}
                            </span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{card.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Chart + Top Destinations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipment Volume Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" /> Weekly Shipment Volume
                        </h3>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">This Week</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={metrics.chartData || []}>
                            <defs>
                                <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 700 }} />
                            <Area type="monotone" dataKey="shipments" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorShipments)" dot={{ fill: '#3b82f6', r: 4 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Destinations */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Top Destinations</h3>
                    <div className="space-y-5">
                        {metrics.topDestinations.map((dest: any, i: number) => {
                            const maxCount = metrics.topDestinations[0]?.count || 1;
                            const pct = Math.round((dest.count / maxCount) * 100);
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold mb-1.5">
                                        <span className="text-slate-700">{dest._id}</span>
                                        <span className="text-slate-400">{dest.count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Strategic Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/customers" className="bg-slate-900 p-6 rounded-[32px] text-white shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all group flex flex-col justify-between h-48">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg leading-tight mb-1 tracking-tight">User Directory</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Manage system roles</p>
                    </div>
                </Link>

                <Link to="/ops/support/complaints" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col justify-between h-48">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 tracking-tight">Support Hub</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Resolve customer issues</p>
                    </div>
                </Link>

                <Link to="/admin/shipments" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col justify-between h-48">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 tracking-tight">Fleet Overview</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Manage all shipments</p>
                    </div>
                </Link>
            </div>

            {/* Pending Alerts */}
            <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8 flex items-center gap-8">
                <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-lg">
                        {metrics.shipments.pending} Shipments Awaiting Action
                    </h4>
                    <p className="text-amber-700 text-sm">Pending payment confirmation or pickup scheduling. Review and assign couriers.</p>
                </div>
                <Link to="/admin/shipments" className="ml-auto bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-amber-700 transition flex-shrink-0">
                    Review Now
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
