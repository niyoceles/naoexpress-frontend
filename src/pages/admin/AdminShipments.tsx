import React, { useEffect, useState } from 'react';
import { Package, Search, Loader2, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { clsx } from 'clsx';

const STATUS_LIST = [
    'draft', 'pickup_scheduled', 'picked_up',
    'at_origin_hub', 'dispatched', 'in_transit', 'at_destination_hub',
    'out_for_delivery', 'delivered', 'delivery_failed', 'returned'
];

const STATUS_COLORS: Record<string, string> = {
    delivered:          'bg-green-50 text-green-700 border-green-200',
    in_transit:         'bg-blue-50 text-blue-700 border-blue-200',
    dispatched:         'bg-purple-50 text-purple-700 border-purple-200',
    out_for_delivery:   'bg-amber-50 text-amber-700 border-amber-200',
    delivery_failed:    'bg-red-50 text-red-700 border-red-200',
    at_origin_hub:      'bg-slate-50 text-slate-700 border-slate-200',
    picked_up:          'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const AdminShipments = () => {
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [total, setTotal] = useState(0);

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const params: any = { limit: 50 };
            if (statusFilter) params.status = statusFilter;
            const res = await api.get('/admin/shipments', { params });
            setShipments(res.data.data);
            setTotal(res.data.pagination?.total || res.data.data.length);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchShipments(); }, [statusFilter]);

    const filtered = shipments.filter(s =>
        !search ||
        s.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.receiver?.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">All Shipments</h1>
                    <p className="text-slate-500">{total} total shipments in the system</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tracking #, customer, or city..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-primary text-sm transition"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All Statuses</option>
                    {STATUS_LIST.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Tracking #</th>
                                <th className="px-8 py-4">Customer</th>
                                <th className="px-8 py-4">Route</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Created</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-16 text-center text-slate-400">
                                        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                        <p className="font-bold">No shipments found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((s: any) => (
                                <tr key={s._id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-900">{s.trackingNumber}</div>
                                        <div className="text-xs text-slate-400 uppercase mt-0.5">{s.type}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="font-medium text-slate-900 text-sm">{s.userId?.name || '—'}</div>
                                        <div className="text-xs text-slate-400">{s.userId?.email}</div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-600">
                                        {s.sender?.city} → {s.receiver?.city}
                                    </td>

                                    <td className="px-8 py-5">
                                        <span className={clsx('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap', STATUS_COLORS[s.status] || 'bg-slate-50 text-slate-600 border-slate-200')}>
                                            {s.status?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-mono">
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link to={`/dashboard/shipments/${s._id}`} className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition">
                                            Details <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminShipments;
