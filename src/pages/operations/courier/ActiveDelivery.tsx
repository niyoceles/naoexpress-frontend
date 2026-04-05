import React, { useEffect, useState } from 'react';
import { Truck, MapPin, DollarSign, CheckCircle2, XCircle, Loader2, Package, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { clsx } from 'clsx';

const ActiveDelivery = () => {
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/courier/analytics');
            setDeliveries(res.data.data.activeDeliveries);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDeliveries(); }, []);

    const handleStatusUpdate = async (shipmentId: string, status: string, description: string) => {
        setUpdating(shipmentId);
        try {
            await api.patch(`/shipments/${shipmentId}/status`, {
                status,
                description,
                location: 'Field Update',
            });
            await fetchDeliveries();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Active Deliveries</h1>
                    <p className="text-slate-500">{deliveries.length} shipments currently out for delivery</p>
                </div>
                <button onClick={fetchDeliveries} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-500">
                    <RefreshCw className="h-5 w-5" />
                </button>
            </header>

            {deliveries.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-400 opacity-60" />
                    <p className="font-bold text-lg">All clear!</p>
                    <p className="text-sm">No active deliveries in the queue right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {deliveries.map((shipment: any) => (
                        <div key={shipment._id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-md transition">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-7 w-7 text-amber-500" />
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 text-lg">{shipment.trackingNumber}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            <MapPin className="h-4 w-4" />
                                            {shipment.receiver?.city}, {shipment.receiver?.country}
                                        </div>
                                        <div className="text-xs font-bold uppercase text-slate-400 mt-1">{shipment.type} · {shipment.status?.replace(/_/g, ' ')}</div>
                                    </div>
                                </div>

                                {shipment.paymentType === 'cod' && (
                                    <div className="flex-shrink-0 bg-amber-100 border border-amber-200 rounded-2xl px-4 py-3 text-center">
                                        <div className="text-xs font-black text-amber-600 uppercase tracking-wider">COD Collect</div>
                                        <div className="text-2xl font-black text-amber-700 mt-0.5">${shipment.codAmount}</div>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                                <button
                                    disabled={!!updating}
                                    onClick={() => handleStatusUpdate(shipment._id, 'delivered', 'Package delivered to recipient.')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition disabled:opacity-50"
                                >
                                    {updating === shipment._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    Mark Delivered
                                </button>
                                <button
                                    disabled={!!updating}
                                    onClick={() => handleStatusUpdate(shipment._id, 'delivery_failed', 'Delivery attempt failed — recipient not available.')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 border border-red-200 py-3 rounded-2xl font-bold hover:bg-red-200 transition disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Mark Failed
                                </button>
                                <Link
                                    to={`/dashboard/shipments/${shipment._id}`}
                                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition text-sm"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveDelivery;
