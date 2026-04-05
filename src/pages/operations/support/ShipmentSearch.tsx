import React, { useState } from 'react';
import { Search, FileSearch, Package, MapPin, Clock, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../services/api';
import { clsx } from 'clsx';

const ShipmentSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await api.get('/support/search', { params: { q: query } });
            setResults(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const STATUS_COLORS: Record<string, string> = {
        delivered:          'bg-green-50 text-green-700 border-green-200',
        in_transit:         'bg-blue-50 text-blue-700 border-blue-200',
        out_for_delivery:   'bg-amber-50 text-amber-700 border-amber-200',
        delivery_failed:    'bg-red-50 text-red-700 border-red-200',
        at_origin_hub:      'bg-purple-50 text-purple-700 border-purple-200',
        pending_payment:    'bg-slate-50 text-slate-600 border-slate-200',
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Shipment Search</h1>
                <p className="text-slate-500">Look up any shipment by tracking number, customer name, or phone.</p>
            </header>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search tracking #, name, or phone..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary transition"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><FileSearch className="h-5 w-5" /> Search</>}
                </button>
            </form>

            {/* Results */}
            {searched && !loading && (
                results.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No shipments found for "{query}"</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-400">{results.length} result(s) found</p>
                        {results.map((shipment: any) => (
                            <div key={shipment._id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                                {/* Summary Row */}
                                <div
                                    className="px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition"
                                    onClick={() => setExpanded(expanded === shipment._id ? null : shipment._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <Package className="h-6 w-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900">{shipment.trackingNumber}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {shipment.sender?.city} → {shipment.receiver?.city}
                                                <span>·</span>
                                                <span>Customer: {shipment.userId?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={clsx('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', STATUS_COLORS[shipment.status] || 'bg-slate-100 text-slate-700 border-slate-200')}>
                                            {shipment.status?.replace(/_/g, ' ')}
                                        </span>
                                        {expanded === shipment._id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                    </div>
                                </div>

                                {/* Expanded Timeline */}
                                {expanded === shipment._id && (
                                    <div className="px-8 pb-6 border-t border-slate-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mt-5 mb-4">Tracking Timeline</h4>
                                        {shipment.events.length === 0 ? (
                                            <p className="text-sm text-slate-400">No events recorded yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {shipment.events.map((ev: any, i: number) => (
                                                    <div key={i} className="flex items-start gap-4">
                                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{ev.status?.replace(/_/g, ' ')} — {ev.location}</div>
                                                            <div className="text-xs text-slate-400">{ev.description}</div>
                                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(ev.timestamp).toLocaleString()} · {ev.actor?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default ShipmentSearch;
