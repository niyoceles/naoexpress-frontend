import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, ArrowRight, Loader2, CheckCircle2, ChevronRight, CreditCard, ShieldCheck, User, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NewShipment = () => {
    const { role } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [staff, setStaff] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        sender: { name: '', email: '', phone: '', address: '', city: 'Kigali', country: 'Rwanda' },
        receiver: { name: '', email: '', phone: '', address: '', city: 'Kigali', country: 'Rwanda' },
        parcels: [{ name: '', weight: 1, dimensions: { length: 10, width: 10, height: 10 }, description: 'Parcel', declaredValue: 100 }],
        type: 'domestic',
        totalWeight: 1,
        shippingCost: 0,
        paymentType: 'prepaid',
        codAmount: 0,
        assignedTo: ''
    });

    useEffect(() => {
        if (role === 'admin' || role === 'warehouse_op') {
            const fetchStaff = async () => {
                setFetchLoading(true);
                try {
                    const res = await api.get('/admin/users');
                    const allUsers = res.data.data || [];
                    setStaff(allUsers.filter((u: any) => 
                        u.role === 'courier' || u.role === 'warehouse_op' || u.role === 'admin'
                    ));
                } catch (err) {
                    console.error("Failed to fetch staff", err);
                } finally {
                    setFetchLoading(false);
                }
            };
            fetchStaff();
        }
    }, [role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...formData };
            if (!payload.assignedTo) delete payload.assignedTo;
            
            await api.post('/shipments', payload);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create shipment. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Shipment Booked!</h1>
                <p className="text-slate-500 mb-10 max-w-md mx-auto">Your free delivery has been scheduled. A courier will contact the sender shortly to pick up the items.</p>
                <div className="flex gap-4">
                    <Link to="/dashboard/shipments" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition">
                        View My Shipments
                    </Link>
                    <button onClick={() => setSuccess(false)} className="bg-white border border-slate-200 text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition">
                        Ship Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Book a Shipment</h1>
                    <p className="text-slate-500">Provide details for your free delivery service.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
                    <ShieldCheck className="h-4 w-4" /> Professional Free Delivery
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                {error && (
                    <div className="p-6 bg-red-50 text-red-700 rounded-3xl border-l-4 border-red-500 font-bold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-xl text-primary"><MapPin className="h-5 w-5" /></div>
                            Sender Information
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                                    <input required type="text" value={formData.sender.name} onChange={(e) => setFormData({...formData, sender: {...formData.sender, name: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Phone Number</label>
                                    <input required type="text" value={formData.sender.phone} onChange={(e) => setFormData({...formData, sender: {...formData.sender, phone: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Email (Optional)</label>
                                <input type="email" value={formData.sender.email} onChange={(e) => setFormData({...formData, sender: {...formData.sender, email: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" placeholder="email@example.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">City</label>
                                    <input required type="text" value={formData.sender.city} onChange={(e) => setFormData({...formData, sender: {...formData.sender, city: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Country</label>
                                    <input required type="text" value={formData.sender.country} onChange={(e) => setFormData({...formData, sender: {...formData.sender, country: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Street Address</label>
                                <input required type="text" value={formData.sender.address} onChange={(e) => setFormData({...formData, sender: {...formData.sender, address: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-amber-50 p-2 rounded-xl text-amber-600"><Target className="h-5 w-5" /></div>
                            Receiver Information
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                                    <input required type="text" value={formData.receiver.name} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, name: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Phone Number</label>
                                    <input required type="text" value={formData.receiver.phone} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, phone: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Email (Optional)</label>
                                <input type="email" value={formData.receiver.email} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, email: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" placeholder="email@example.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">City</label>
                                    <input required type="text" value={formData.receiver.city} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, city: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Country</label>
                                    <input required type="text" value={formData.receiver.country} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, country: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Street Address</label>
                                <input required type="text" value={formData.receiver.address} onChange={(e) => setFormData({...formData, receiver: {...formData.receiver, address: e.target.value}})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Package className="h-5 w-5" /></div>
                            Cargo Summary & Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Parcel Name / Item Title</label>
                                    <input 
                                        required 
                                        type="text" 
                                        placeholder="e.g. MacBook Pro, Birthday Gift"
                                        value={formData.parcels[0].name} 
                                        onChange={(e) => {
                                            const newParcels = [...formData.parcels];
                                            newParcels[0].name = e.target.value;
                                            setFormData({...formData, parcels: newParcels});
                                        }} 
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition font-bold" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Description of Contents</label>
                                    <textarea 
                                        required 
                                        rows={3}
                                        placeholder="Briefly describe what's inside..."
                                        value={formData.parcels[0].description} 
                                        onChange={(e) => {
                                            const newParcels = [...formData.parcels];
                                            newParcels[0].description = e.target.value;
                                            setFormData({...formData, parcels: newParcels});
                                        }} 
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Weight (kg)</label>
                                        <input required type="number" min="0.1" step="0.1" value={formData.totalWeight} onChange={(e) => setFormData({...formData, totalWeight: parseFloat(e.target.value) || 0})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Category</label>
                                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition">
                                            <option value="domestic">Domestic</option>
                                            <option value="international">International</option>
                                        </select>
                                    </div>
                                </div>

                                {(role === 'admin' || role === 'warehouse_op') && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Assign Courier / Staff</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-hover:text-primary transition" />
                                            <select 
                                                value={formData.assignedTo} 
                                                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} 
                                                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition appearance-none font-bold"
                                            >
                                                <option value="">Auto-Assign Later</option>
                                                {staff.map(u => (
                                                    <option key={u._id} value={u._id}>{u.name} ({u.role.replace('_', ' ')})</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-slate-300 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Service Note</p>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Delivery for standard parcels is currently <span className="text-green-600 font-bold">FREE of charge</span>. Our system handles all scheduling and logistics automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-12 pt-8">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary text-white px-16 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[0.98] transition shadow-2xl shadow-blue-200 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Confirm Free Booking <ArrowRight className="h-6 w-6" /></>}
                    </button>
                </div>
            </form>
        </div>
    );
};

const Target = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default NewShipment;
