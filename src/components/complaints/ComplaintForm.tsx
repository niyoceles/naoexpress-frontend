import React, { useState } from 'react';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import api from '../../services/api';

interface ComplaintFormProps {
    shipmentId?: string;
    onSuccess?: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ shipmentId, onSuccess }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
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
                priority
            });
            setMessage('Complaint submitted successfully. Our team will review it shortly.');
            setSubject('');
            setDescription('');
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
                <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Subject</label>
                    <input 
                        type="text" 
                        required 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. Delayed delivery, Damaged item"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Priority</label>
                    <select 
                        value={priority} 
                        onChange={e => setPriority(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition font-bold"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Description</label>
                    <textarea 
                        required 
                        rows={4}
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Please provide details about your issue..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
