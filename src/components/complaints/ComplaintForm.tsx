import React, { useState } from 'react';
import { AlertCircle, Loader2, Send, Hash, Mail, Phone } from 'lucide-react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

interface ComplaintFormProps {
    shipmentId?: string;
    initialTrackingNumber?: string;
    onSuccess?: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ shipmentId, initialTrackingNumber, onSuccess }) => {
    const { name, isAuthenticated } = useAuth();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/complaints', {
                subject,
                description,
                shipmentId,
                trackingNumber: !shipmentId ? trackingNumber : undefined,
                priority,
                guestEmail: email,
                guestPhone: phone
            });
            setMessage('Complaint submitted successfully. Our team will review it shortly.');
            setSubject('');
            setDescription('');
            if (!initialTrackingNumber) setTrackingNumber('');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-8">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Report an Issue
            </h3>
            
            {message && (
                <div className={`mb-4 p-4 rounded-xl text-sm font-medium animate-in fade-in zoom-in-95 ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">Contact Information</span>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                placeholder="For updates"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                            <input 
                                type="tel" 
                                required
                                value={phone} 
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+250..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition text-sm"
                            />
                        </div>
                    </div>
                </div>

                {!shipmentId && (
                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Tracking Number</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            required 
                            value={trackingNumber} 
                            onChange={e => setTrackingNumber(e.target.value.toUpperCase())}
                            placeholder="RX-2024-XXXX"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition text-sm font-bold"
                        />
                    </div>
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Subject</label>
                        <input 
                            type="text" 
                            required 
                            value={subject} 
                            onChange={e => setSubject(e.target.value)}
                            placeholder="e.g. Delayed delivery"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition text-sm"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Priority</label>
                        <select 
                            value={priority} 
                            onChange={e => setPriority(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition font-bold text-sm"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Description</label>
                    <textarea 
                        required 
                        rows={4}
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Please provide details about your issue..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition text-sm"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition shadow-lg shadow-slate-100"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
