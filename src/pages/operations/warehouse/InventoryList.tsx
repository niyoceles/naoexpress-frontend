import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, Loader2, RefreshCw, MapPin, Box, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { clsx } from 'clsx';

const InventoryList = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/inventory/skus');
            setItems(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.binLocation.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Central Inventory</h1>
                    <p className="text-slate-500 font-medium">Manage physical stocks, SKUs, and storage locations across all hubs.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/ops/warehouse/stock-in" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-700 transition shadow-lg shadow-slate-900/10">
                        <Plus className="h-5 w-5" /> Receive Stock
                    </Link>
                    <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition shadow-sm text-slate-500">
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by SKU, Product Name, or Bin Location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-3xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                        <Box className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                        <p className="text-slate-500 font-bold">No inventory items matching your search.</p>
                    </div>
                ) : filtered.map((item: any) => (
                    <div key={item._id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <Package className="h-7 w-7" />
                            </div>
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                item.quantity > 50 ? "bg-green-50 text-green-600 border-green-100" :
                                item.quantity > 0 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                "bg-red-50 text-red-600 border-red-100"
                            )}>
                                {item.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{item.sku}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 items-center flex gap-1">
                                    <MapPin className="h-3 w-3" /> Location
                                </div>
                                <div className="font-bold text-slate-700 text-sm">{item.binLocation}</div>
                                <div className="text-[10px] text-slate-400 font-bold">Zone {item.zone}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 items-center flex gap-1 text-right justify-end">
                                    <Activity className="h-3 w-3" /> Quantity
                                </div>
                                <div className="font-black text-slate-900 ml-auto w-fit text-xl">{item.quantity}</div>
                                {item.quantity <= 10 && item.quantity > 0 && (
                                    <div className="text-[9px] text-amber-500 font-black uppercase flex items-center gap-1 justify-end">
                                        <AlertTriangle className="h-2.5 w-2.5" /> Low Stock
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryList;
