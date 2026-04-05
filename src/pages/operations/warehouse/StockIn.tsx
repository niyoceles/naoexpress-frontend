import React, { useState, useEffect } from 'react';
import { Package, Search, Loader2, ArrowLeft, CheckCircle2, ChevronRight, Warehouse, MapPin, Inbox } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { clsx } from 'clsx';

const StockIn = () => {
    const navigate = useNavigate();
    const [skus, setSkus] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [search, setSearch] = useState('');
    const [selectedSku, setSelectedSku] = useState<any>(null);

    const [formData, setFormData] = useState({
        warehouseId: '',
        quantity: '',
        zoneCode: 'A',
        binLocation: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skusRes, whRes] = await Promise.all([
                    api.get('/inventory/skus'),
                    api.get('/admin/warehouses') // Adjust if needed
                ]);
                setSkus(skusRes.data.data);
                setWarehouses(whRes.data.data);
                if (whRes.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, warehouseId: whRes.data.data[0]._id }));
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSku) return alert("Please select a SKU");
        
        setIsSubmitting(true);
        try {
            await api.post('/inventory/stock-in', {
                skuId: selectedSku._id,
                ...formData,
                quantity: parseInt(formData.quantity)
            });
            alert("Stock successfully received!");
            navigate('/ops/warehouse');
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to stock in");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSkus = skus.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.sku.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header className="flex items-center gap-4">
                <Link to="/ops/warehouse" className="p-2 hover:bg-slate-100 rounded-xl transition">
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Receive Goods</h1>
                    <p className="text-slate-500">Record physical stock arrival at the hub.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1: Select SKU */}
                <div className="md:col-span-1 space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 1: Select Product</div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search SKUs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto divide-y divide-slate-50">
                        {filteredSkus.map(s => (
                            <button
                                key={s._id}
                                onClick={() => setSelectedSku(s)}
                                className={clsx(
                                    'w-full text-left p-4 flex flex-col gap-1 transition',
                                    selectedSku?._id === s._id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-slate-50'
                                )}
                            >
                                <span className={clsx('font-bold text-sm', selectedSku?._id === s._id ? 'text-primary' : 'text-slate-900')}>{s.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{s.sku}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Details */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 2: Reception Details</div>
                        
                        {selectedSku ? (
                            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Selection</div>
                                    <div className="font-black text-slate-900">{selectedSku.name}</div>
                                </div>
                                <div className="ml-auto bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-green-100">
                                    SKU Verified
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400 flex flex-col items-center gap-3">
                                <Inbox className="h-8 w-8 opacity-20" />
                                <p className="font-bold text-sm">Please select a product from the left list.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Target Warehouse</label>
                                <div className="relative">
                                    <Warehouse className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <select 
                                        required
                                        value={formData.warehouseId}
                                        onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none appearance-none focus:ring-2 focus:ring-primary"
                                    >
                                        {warehouses.map(wh => (
                                            <option key={wh._id} value={wh._id}>{wh.name} ({wh.code})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Quantity Received</label>
                                <input 
                                    required 
                                    type="number" 
                                    min="1"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Storage Zone</label>
                                <select 
                                    required
                                    value={formData.zoneCode}
                                    onChange={e => setFormData({ ...formData, zoneCode: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="A">Zone A (General)</option>
                                    <option value="B">Zone B (High Value)</option>
                                    <option value="C">Zone C (Bulk)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Bin Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <input 
                                        required 
                                        type="text" 
                                        placeholder="e.g. A-12-04"
                                        value={formData.binLocation}
                                        onChange={e => setFormData({ ...formData, binLocation: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit"
                                disabled={!selectedSku || isSubmitting}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition disabled:opacity-50 shadow-xl shadow-slate-900/10"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                                Complete Reception
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StockIn;
