import React from 'react';
import { Headphones, ShieldCheck, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const GuestSupport = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-20 pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                {/* Left Side: Content */}
                <div className="space-y-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                            <Headphones className="h-4 w-4" />
                            Help & Support
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            Resolution <span className="text-primary">Center</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                            Have an issue with your shipment or need assistance with our services? 
                            Our support experts are here to ensure your logistics experience is seamless.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Fast Response Times</h4>
                                <p className="text-slate-500 text-sm">We typically respond to new tickets within 2-4 business hours.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Secure Resolution</h4>
                                <p className="text-slate-500 text-sm">Every ticket is encrypted and only accessible by authorized support staff.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50 flex-shrink-0">
                                <MessageCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Expert Assistance</h4>
                                <p className="text-slate-500 text-sm">Connect directly with logistics professionals who understand your cargo's journey.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <Headphones className="h-40 w-40 transform translate-x-10 translate-y-10" />
                        </div>
                        <h5 className="font-black uppercase tracking-widest text-xs text-primary mb-4">Urgent Matters</h5>
                        <p className="text-sm text-slate-300 leading-relaxed relative z-10 font-medium">
                            If your inquiry is regarding a high-value shipment or requires immediate safety intervention, 
                            please mark the priority as <span className="text-white font-bold underline">Urgent</span> in the form.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="bg-white p-1 rounded-[42px] shadow-2xl shadow-slate-200 border border-slate-100">
                        <div className="bg-primary p-10 rounded-[40px] text-white mb-2">
                            <h3 className="text-2xl font-black mb-2">Initiate Request</h3>
                            <p className="text-blue-100 text-sm opacity-80">Fill out the details below to start your resolution process.</p>
                        </div>
                        <div className="p-2 pt-0">
                            <ComplaintForm />
                        </div>
                        <div className="px-10 pb-8 pt-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500">
                                <AlertCircle className="h-4 w-4 text-slate-400" />
                                Please include your tracking number if your issue relates to a specific shipment.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestSupport;
