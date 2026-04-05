import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, ArrowRight, Loader2, CheckCircle2, ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const NewShipment = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [currency, setCurrency] = useState<'RWF' | 'USD'>('RWF'); // tracks quote currency
    
    const [formData, setFormData] = useState({
        sender:   { name: '', email: '', phone: '', address: '', city: 'Kigali', country: 'Rwanda' },
        receiver: { name: '', email: '', phone: '', address: '', city: 'Kigali', country: 'Rwanda' },
        parcels: [{ weight: 1, dimensions: { length: 10, width: 10, height: 10 }, description: 'Parcel', declaredValue: 100 }],
        type: 'domestic',
        totalWeight: 1,
        shippingCost: 0,
        paymentType: 'prepaid',
        codAmount: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/shipments', formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create shipment.');
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
                    <button onClick={() => { setSuccess(false); }} className="bg-white border border-slate-200 text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition">
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
                    {/* Sender Section */}
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

                    {/* Receiver Section */}
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

                    {/* Parcel Details Section */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Package className="h-5 w-5" /></div>
                            Parcel Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Total Weight (kg)</label>
                                <input required type="number" min="0.1" step="0.1" value={formData.totalWeight} onChange={(e) => setFormData({...formData, totalWeight: parseFloat(e.target.value) || 0})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Shipment Category</label>
                                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition">
                                    <option value="domestic">Domestic Delivery</option>
                                    <option value="international">International Shipping</option>
                                </select>
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
