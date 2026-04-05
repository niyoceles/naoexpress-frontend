import React, { useEffect, useState } from 'react';
import { Package, Truck, Search, Filter, Loader2, MoreVertical, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { clsx } from 'clsx';

const ShipmentsList = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await api.get('/shipments');
                setShipments(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch shipments.');
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-slate-500 font-bold">Fetching your global cargo data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Global Shipments</h1>
                    <p className="text-slate-500">Managing {shipments.length} active and archived cargo records.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Filter by ID..." className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-64 transition" />
                    </div>
                    <button className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {shipments.length === 0 ? (
                <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-32 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No shipments found.</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't registered any shipments yet. Get started with your first delivery.</p>
                    <Link to="/dashboard/shipments/new" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition inline-flex items-center gap-2">
                        Ship Now
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-10 py-5">TX-TRACK-ID</th>
                                    <th className="px-10 py-5">Logistics Route</th>
                                    <th className="px-10 py-5">Current Status</th>
                                    <th className="px-10 py-5">Created At</th>
                                    <th className="px-10 py-5 text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {shipments.map((shipment: any) => (
                                    <tr key={shipment._id} className="hover:bg-slate-50/50 transition duration-300 group">
                                        <td className="px-10 py-7">
                                            <div className="font-extrabold text-slate-900 group-hover:text-primary transition">{shipment.trackingNumber}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Express Cargo</div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                <MapPin className="h-4 w-4 text-slate-300" />
                                                {shipment.sender.city} &rarr; {shipment.receiver.city}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 capitalize">{shipment.type} Shipping</div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={clsx(
                                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                shipment.status === 'delivered' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                            )}>
                                                {shipment.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 text-sm font-medium text-slate-500 font-mono italic">
                                            {new Date(shipment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-7 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/dashboard/shipments/${shipment._id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition">
                                                    <ExternalLink className="h-5 w-5" />
                                                </Link>
                                                <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipmentsList;
