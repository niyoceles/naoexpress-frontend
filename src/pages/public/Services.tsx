import React from 'react';
import { Truck, Globe, Warehouse, Zap, ShieldCheck, Headphones } from 'lucide-react';
import heroImage from '../../assets/logistics_rwanda_hero.png';

const Services = () => {
    const services = [
        {
            icon: Zap,
            title: 'Kigali Express',
            description: 'Lightning-fast, same-day delivery across the heart of Kigali. Perfect for urgent documents and time-sensitive parcels.',
            accent: 'bg-amber-50 text-amber-600 border-amber-100'
        },
        {
            icon: Truck,
            title: 'National Distribution',
            description: 'Comprehensive reach across all 30 districts of Rwanda. We connect urban centers and rural communities with daily routes.',
            accent: 'bg-blue-50 text-blue-600 border-blue-100'
        },
        {
            icon: Globe,
            title: 'International Gateway',
            description: 'Direct shipping solutions from Kigali to the world. We handle customs and logistics for seamless global transit.',
            accent: 'bg-indigo-50 text-indigo-600 border-indigo-100'
        },
        {
            icon: Warehouse,
            title: 'Smart Warehousing',
            description: 'Secure, climate-controlled storage in Kicukiro. Inventory management and fulfillment services tailored for e-commerce.',
            accent: 'bg-slate-50 text-slate-600 border-slate-100'
        }
    ];

    return (
        <div className="space-y-24 pb-40">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center overflow-hidden rounded-[60px] mx-4 mt-4 shadow-3xl">
                <img 
                    src={heroImage} 
                    alt="NAO Express Logistics in Rwanda" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-10">
                    <span className="inline-block px-4 py-1.5 bg-accent-orange text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
                        Logistics Reimagined
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                        The Pulse of <br />
                        <span className="text-secondary italic">Rwanda's</span> Trade
                    </h1>
                    <p className="text-slate-200 text-lg md:text-xl font-medium max-w-xl leading-relaxed opacity-90">
                        From the rolling hills of Nyagatare to the bustling streets of Kigali, 
                        we provide the infrastructure that keeps Rwanda moving.
                    </p>
                </div>
            </section>

            {/* Service Grid */}
            <section className="max-w-7xl mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {services.map((s, i) => (
                        <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                            <div className={`w-16 h-16 rounded-2xl ${s.accent} flex items-center justify-center mb-10 border transition-transform group-hover:rotate-12`}>
                                <s.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors">
                                {s.title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 opacity-80">
                                {s.description}
                            </p>
                            <div className="w-10 h-1 bg-slate-100 rounded-full group-hover:w-full group-hover:bg-accent-orange transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-slate-900 py-32 rounded-[80px] mx-4 shadow-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600 transform skew-x-12 translate-x-1/2 opacity-10" />
                <div className="max-w-7xl mx-auto px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl font-black mb-8 tracking-tight">
                            Reliability That <br />
                            <span className="text-accent-orange">Empowers</span> Growth
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="h-6 w-6 text-accent-orange" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Unmatched Security</h4>
                                    <p className="text-slate-400 font-medium">Real-time GPS tracking and secure handling protocols for every parcel.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Headphones className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Local Expertise</h4>
                                    <p className="text-slate-400 font-medium">Native-speaking support teams based in Kicukiro available at +250 788 550 184.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[60px] shadow-2xl">
                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div className="p-8">
                                <div className="text-4xl font-black text-accent-orange mb-2">30+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Districts Served</div>
                            </div>
                            <div className="p-8">
                                <div className="text-4xl font-black text-indigo-400 mb-2">99.8%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Safety Record</div>
                            </div>
                            <div className="p-8">
                                <div className="text-4xl font-black text-white mb-2">24h</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Guarantee</div>
                            </div>
                            <div className="p-8">
                                <div className="text-4xl font-black text-slate-400 mb-2">50k+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Happy Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
