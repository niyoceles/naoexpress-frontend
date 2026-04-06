import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, CheckCircle2, TrendingUp, PlusCircle, Loader2, Headphones, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import clsx from 'clsx';

const DashboardHome = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/customer/analytics');
                setDashboardData(res.data.data);
            } catch (error) {
                console.error("Failed to load customer dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading || !dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const { metrics, recentShipments } = dashboardData;

    const stats = [
        { label: 'Active Shipments', value: metrics.active, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'In Transit', value: metrics.inTransit, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Delivered', value: metrics.delivered, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Support & Help', value: 'Resolution Center', icon: Headphones, color: 'text-rose-600', bg: 'bg-rose-50', link: '/dashboard/support' },
    ];

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back.</h1>
                    <p className="text-slate-500">Here's what's happening with your shipments today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/support?new=true" className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition shadow-sm">
                        <AlertCircle className="h-5 w-5 text-rose-500" />
                        Report Issue
                    </Link>
                    <Link to="/dashboard/shipments/new" className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-blue-100">
                        <PlusCircle className="h-5 w-5" />
                        Ship New Parcel
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <Link key={index} to={stat.link || '#'} className={clsx(
                        "bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100 hover:shadow-md transition group",
                        !stat.link && "cursor-default"
                    )}>
                        <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Recent Shipments</h3>
                    <Link to="/dashboard/shipments" className="text-sm font-bold text-primary hover:underline">View all</Link>
                </div>
                {recentShipments && recentShipments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-10 py-4">Tracking Number</th>
                                    <th className="px-10 py-4">Destination</th>
                                    <th className="px-10 py-4">Status</th>
                                    <th className="px-10 py-4">Created Date</th>
                                    <th className="px-10 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentShipments.map((shipment: any) => (
                                    <tr key={shipment._id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-10 py-6">
                                            <div className="font-bold text-slate-900">{shipment.trackingNumber}</div>
                                            <div className="text-xs text-slate-400 uppercase">{shipment.type}</div>
                                        </td>
                                        <td className="px-10 py-6 text-sm text-slate-600 font-medium">
                                            {shipment.receiver?.city}, {shipment.receiver?.country}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100 whitespace-nowrap">
                                                {shipment.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-sm text-slate-500 font-medium font-mono">
                                            {new Date(shipment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <Link to={`/dashboard/shipments/${shipment._id}`} className="text-primary font-bold text-sm hover:underline">Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 py-16">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No tracking records found.</p>
                        <p className="text-sm mt-1">When you create or receive shipments, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
