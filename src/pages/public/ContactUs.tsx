import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, Send, Loader2, CheckCircle2, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';

const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/contacts', { email, phone, subject, message });
            setSuccess(true);
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20 pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <div className="space-y-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                            <Mail className="h-4 w-4" />
                            Get in touch
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            Contact <span className="text-indigo-600">Us</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                            Have questions about our services or need custom logistics solutions? 
                            Our team is ready to help you optimize your supply chain.
                        </p>
                    </div>

                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <Phone className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Direct Call Support</h4>
                                <p className="text-slate-500 text-sm font-medium">+250 788 550 184 (Standard Rates Apply)</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Standard Support Hours</h4>
                                <p className="text-slate-500 text-sm">Mon - Fri: 8:00 AM - 6:00 PM (GMT+2)</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <MapPin className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Headquarters</h4>
                                <p className="text-slate-500 text-sm">Main Street, Kicukiro, Kigali, Rwanda</p>
                            </div>
                        </div>

                    <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <Mail className="h-40 w-40 transform translate-x-10 translate-y-10" />
                        </div>
                        <h5 className="font-black uppercase tracking-widest text-xs text-indigo-400 mb-4">Express Inquiries</h5>
                        <p className="text-sm text-slate-300 leading-relaxed relative z-10 font-medium">
                            For existing shipment issues, please use our <a href="/track" className="text-white font-bold underline">Tracking System</a> to report a problem directly to our logistics team.
                        </p>
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="bg-white p-1 rounded-[42px] shadow-2xl shadow-slate-200 border border-slate-100">
                        <div className="bg-indigo-600 p-10 rounded-[40px] text-white mb-2">
                            <h3 className="text-2xl font-black mb-2">Send a Message</h3>
                            <p className="text-indigo-100 text-sm opacity-80">Fill out the form below and we'll get back to you shortly.</p>
                        </div>
                        
                        <div className="p-8">
                            {success ? (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">Message Sent!</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">We've received your inquiry and will contact you via email as soon as possible.</p>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="mt-8 text-indigo-600 font-bold uppercase tracking-widest text-xs hover:underline">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            required 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            value={phone} 
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+250 7..."
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Subject</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={subject} 
                                            onChange={e => setSubject(e.target.value)}
                                            placeholder="How can we help?"
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Description</label>
                                        <textarea 
                                            required 
                                            rows={5}
                                            value={message} 
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Tell us about your inquiry..."
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition resize-none"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition shadow-xl shadow-slate-200"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                        Submit Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
