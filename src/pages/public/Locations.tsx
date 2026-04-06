import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Globe, ArrowRight } from 'lucide-react';

const Locations = () => {
    const locations = [
        {
            name: 'Kicukiro Headquarters',
            address: 'Kicukiro District, Kigali, Rwanda',
            description: 'Our primary sorting facility and administrative heart. Serving as the master-hub for all national and international operations.',
            phone: '+250 788 550 184',
            type: 'HQ',
            status: 'Operational',
            badge: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        },
        {
            name: 'Musanze Hub',
            address: 'Northern Province, Rwanda',
            description: 'Gateway to the north. Connecting businesses and individuals across the volcanic region.',
            phone: '+250 788 550 184',
            type: 'Regional',
            status: 'Coming Soon',
            badge: 'bg-amber-50 text-amber-600 border-amber-100'
        },
        {
            name: 'Rusizi Trade Post',
            address: 'Western Province Hub, Rwanda',
            description: 'Strategically positioned at the border to facilitate seamless trade with the DRC and Kivu region.',
            phone: '+250 788 550 184',
            type: 'Strategic',
            status: 'Coming Soon',
            badge: 'bg-amber-50 text-amber-600 border-amber-100'
        },
        {
            name: 'Huye Logistics Center',
            address: 'Southern Province Hub, Rwanda',
            description: 'Servicing the intellectual and agricultural heart of the south with dedicated routes.',
            phone: '+250 788 550 184',
            type: 'Regional',
            status: 'Coming Soon',
            badge: 'bg-amber-50 text-amber-600 border-amber-100'
        },
        {
            name: 'Nyagatare Hub',
            address: 'Eastern Province, Rwanda',
            description: 'Connecting the rolling hills of the east to the national logistics network.',
            phone: '+250 788 550 184',
            type: 'Regional',
            status: 'Coming Soon',
            badge: 'bg-amber-50 text-amber-600 border-amber-100'
        }
    ];

    return (
        <div className="space-y-32 pb-40 px-4 mt-12 max-w-7xl mx-auto">
            <header className="text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                    <MapPin className="h-4 w-4" />
                    Network Presence
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
                    Our <span className="text-indigo-600">Footprint</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    Based in the vibrant heart of Kicukiro, we are rapidly expanding our grid 
                    to cover every corner of the Land of a Thousand Hills.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {locations.map((loc, i) => (
                    <div key={i} className="group bg-white p-1 rounded-[42px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="p-10 rounded-[40px] flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${loc.badge}`}>
                                    {loc.status}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{loc.type}</span>
                            </div>
                            
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{loc.name}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 opacity-80 flex-grow">
                                {loc.description}
                            </p>
                            
                            <div className="space-y-4 border-t border-slate-50 pt-8 mt-auto">
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                    {loc.address}
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                    <Phone className="h-5 w-5 text-accent-orange" />
                                    {loc.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className="bg-indigo-600 rounded-[60px] p-20 text-white relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl font-black mb-8 leading-tight tracking-tight">Need a customized <br /> logistic plan?</h2>
                        <p className="text-indigo-100 text-lg opacity-90 font-medium mb-10 leading-relaxed max-w-lg">
                            We offer specialized solutions for corporate fleets and high-volume e-commerce enterprises across Rwanda.
                        </p>
                        <a href="/support" className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition shadow-lg shadow-indigo-900/10">
                            Book a Consultation <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]">
                            <h5 className="font-bold mb-1">HQ Desk</h5>
                            <p className="text-xs opacity-60">Located in Kicukiro</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]">
                            <h5 className="font-bold mb-1">Live Tracking</h5>
                            <p className="text-xs opacity-60">24/7 Monitoring</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]">
                            <h5 className="font-bold mb-1">Local Reach</h5>
                            <p className="text-xs opacity-60">Full District Coverage</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]">
                            <h5 className="font-bold mb-1">Safe Transit</h5>
                            <p className="text-xs opacity-60">Insured Delivery</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Locations;
