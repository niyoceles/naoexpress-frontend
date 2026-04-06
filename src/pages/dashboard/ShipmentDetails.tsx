import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Package, MapPin, Target, Truck, Calendar, CreditCard, 
    CheckCircle2, Clock, Map, Loader2, User as UserIcon, Edit2, X, Save
} from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const STATUS_ICONS: Record<string, React.FC<any>> = {
    draft: Clock,
    pickup_scheduled: Calendar,
    picked_up: Package,
    at_origin_hub: MapPin,
    dispatched: Truck,
    in_transit: Map,
    at_destination_hub: MapPin,
    out_for_delivery: Truck,
    delivered: CheckCircle2
};

const ShipmentDetails = () => {
    const { id } = useParams();
    const [shipment, setShipment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Admin operation states
    const [updateStatus, setUpdateStatus] = useState('');
    const [updateLocation, setUpdateLocation] = useState('');
    const [updateDesc, setUpdateDesc] = useState('');
    const [updating, setUpdating] = useState(false);
    
    // Detailed Edit states (Admin only)
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const role = localStorage.getItem('role') || 'customer';
    const canUpdate = ['admin', 'courier', 'warehouse_op'].includes(role);

    const fetchShipment = async () => {
        try {
            const res = await api.get(`/shipments/${id}`);
            setShipment(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load shipment details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipment();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateStatus || !updateLocation || !updateDesc) return;

        setUpdating(true);
        try {
            await api.patch(`/shipments/${id}/status`, {
                status: updateStatus,
                location: updateLocation,
                description: updateDesc
            });
            
            // Refresh data to show new event in timeline
            await fetchShipment();
            
            // Clear form
            setUpdateStatus('');
            setUpdateLocation('');
            setUpdateDesc('');
            
            // Success feedback could go here, but a refresh is often enough visually
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update shipment status');
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put(`/shipments/${id}/details`, editForm);
            await fetchShipment();
            setIsEditing(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update details');
        } finally {
            setIsSaving(false);
        }
    };

    const startEditing = () => {
        setEditForm({
            sender: { ...shipment.sender },
            receiver: { ...shipment.receiver }
        });
        setIsEditing(true);
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="p-8 text-center bg-red-50 text-red-600 font-bold rounded-3xl">{error}</div>;
    if (!shipment) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/dashboard/shipments" className="p-3 bg-white rounded-full hover:bg-slate-50 border border-slate-100 transition shadow-sm">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipment Details</h1>
                    <p className="text-slate-500 font-mono text-sm mt-1">{shipment.trackingNumber}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {role === 'admin' && (
                        <button 
                            onClick={startEditing}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Contacts
                        </button>
                    )}
                    <span className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        {shipment.status.replace(/_/g, ' ')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Details & Map */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Routing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <div className="bg-blue-50 p-1.5 rounded-lg text-primary"><MapPin className="h-4 w-4" /></div>
                                Origin
                            </h3>
                            <div className="font-bold text-slate-900 text-lg mb-1">{shipment.sender.name}</div>
                            <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-500 mb-4">
                                <span>{shipment.sender.phone}</span>
                                {shipment.sender.email && <span className="text-primary italic">{shipment.sender.email}</span>}
                            </div>
                            <div className="text-slate-600">
                                {shipment.sender.address}<br/>
                                <span className="font-bold">{shipment.sender.city}, {shipment.sender.country}</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 to-transparent pointer-events-none"></div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 relative z-10">
                                <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600"><Target className="h-4 w-4" /></div>
                                Destination
                            </h3>
                            <div className="font-bold text-slate-900 text-lg mb-1 relative z-10">{shipment.receiver.name}</div>
                            <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-500 mb-4 relative z-10">
                                <span>{shipment.receiver.phone}</span>
                                {shipment.receiver.email && <span className="text-amber-600 italic">{shipment.receiver.email}</span>}
                            </div>
                            <div className="text-slate-600 relative z-10">
                                {shipment.receiver.address}<br/>
                                <span className="font-bold">{shipment.receiver.city}, {shipment.receiver.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Parcel Summary */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                                <Package className="h-5 w-5 text-purple-500" />
                                Cargo Summary
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-slate-50">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Service Type</span>
                                    <span className="font-bold capitalize">{shipment.type} Express</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Weight</span>
                                    <span className="font-bold">{shipment.totalWeight} kg</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Pieces</span>
                                    <span className="font-bold">{shipment.parcels.length} Items</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Itemized Manifest</h4>
                            <div className="space-y-3">
                                {shipment.parcels.map((p: any, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 font-bold text-xs text-slate-400">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 mb-0.5">{p.name || 'Unnamed Parcel'}</div>
                                            <div className="text-sm text-slate-500 leading-relaxed font-medium">
                                                {p.description || 'No description provided.'}
                                            </div>
                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400">
                                                    Weight: {p.weight}kg
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Complaint Form for Customers */}
                    {role === 'customer' && (
                        <ComplaintForm shipmentId={shipment._id} />
                    )}

                    {/* Operator Timeline Updates (Visible only to authorized roles) */}
                    {canUpdate && (
                        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-emerald-400" />
                                Operator Control Panel
                            </h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select 
                                        required 
                                        value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white outline-none focus:ring-2 focus:ring-primary appearance-none font-bold"
                                    >
                                        <option value="" className="text-slate-900">-- Select New Status --</option>
                                        <option value="pickup_scheduled" className="text-slate-900">Pickup Scheduled</option>
                                        <option value="picked_up" className="text-slate-900">Picked Up</option>
                                        <option value="at_origin_hub" className="text-slate-900">At Origin Hub</option>
                                        <option value="dispatched" className="text-slate-900">Dispatched</option>
                                        <option value="in_transit" className="text-slate-900">In Transit</option>
                                        <option value="at_destination_hub" className="text-slate-900">At Destination Hub</option>
                                        <option value="out_for_delivery" className="text-slate-900">Out For Delivery</option>
                                        <option value="delivered" className="text-slate-900">Delivered</option>
                                        <option value="delivery_failed" className="text-slate-900">Delivery Failed</option>
                                    </select>
                                    <input 
                                        required type="text" placeholder="Current Location (e.g. Kigali Hub)"
                                        value={updateLocation} onChange={e => setUpdateLocation(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-primary text-white"
                                    />
                                </div>
                                <input 
                                    required type="text" placeholder="Activity Description (e.g. Package scanned and loaded onto outbound truck)"
                                    value={updateDesc} onChange={e => setUpdateDesc(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-primary text-white"
                                />
                                <div className="pt-2">
                                    <button 
                                        type="submit" disabled={updating || !updateStatus}
                                        className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-black transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {updating ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Publish Status Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column: Tracking Timeline */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                    <h3 className="font-bold text-slate-900 text-lg mb-8 flex items-center gap-2">
                        <Map className="h-5 w-5 text-slate-400" />
                        Live Tracking History
                    </h3>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
                        {shipment.events?.map((event: any, i: number) => {
                            const isFirst = i === 0;
                            const Icon = STATUS_ICONS[event.status.toLowerCase()] || CheckCircle2;
                            return (
                                <div key={event._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon */}
                                    <div className={clsx(
                                        'flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10',
                                        isFirst ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                                    )}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    
                                    {/* Content Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={clsx('font-black text-sm uppercase tracking-wider', isFirst ? 'text-primary' : 'text-slate-700')}>
                                                {event.status.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm">{event.description}</p>
                                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <MapPin className="h-3 w-3" /> {event.location}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {(!shipment.events || shipment.events.length === 0) && (
                            <div className="text-center text-slate-400 py-10 font-bold">No tracking events found yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Edit Modal */}
            {isEditing && editForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Shipment Information</h3>
                                <p className="text-slate-500 text-sm">Update contact details for this waybill.</p>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full transition">
                                <X className="h-6 w-6 text-slate-500" />
                            </button>
                        </header>
                        
                        <form onSubmit={handleSaveDetails} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Sender Edit */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                                        <MapPin className="h-3 w-3" /> Sender Details
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                                            <input type="text" value={editForm.sender.name} onChange={e => setEditForm({...editForm, sender: {...editForm.sender, name: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                                                <input type="text" value={editForm.sender.phone} onChange={e => setEditForm({...editForm, sender: {...editForm.sender, phone: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                                                <input type="email" value={editForm.sender.email} onChange={e => setEditForm({...editForm, sender: {...editForm.sender, email: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address</label>
                                            <input type="text" value={editForm.sender.address} onChange={e => setEditForm({...editForm, sender: {...editForm.sender, address: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                        </div>
                                    </div>
                                </div>

                                {/* Receiver Edit */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[10px]">
                                        <Target className="h-3 w-3" /> Receiver Details
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                                            <input type="text" value={editForm.receiver.name} onChange={e => setEditForm({...editForm, receiver: {...editForm.receiver, name: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                                                <input type="text" value={editForm.receiver.phone} onChange={e => setEditForm({...editForm, receiver: {...editForm.receiver, phone: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                                                <input type="email" value={editForm.receiver.email} onChange={e => setEditForm({...editForm, receiver: {...editForm.receiver, email: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address</label>
                                            <input type="text" value={editForm.receiver.address} onChange={e => setEditForm({...editForm, receiver: {...editForm.receiver, address: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 transition disabled:opacity-50">
                                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipmentDetails;
