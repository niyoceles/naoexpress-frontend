import React from 'react';
import { ArrowRight, Globe, Shield, Zap, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-52">
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6">
                            Fast & Reliable Delivery
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                            Deliver <span className="text-primary italic">Anything,</span> Anywhere.
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            NAO Express connects businesses and consumers with premium door-to-door delivery, cross-border shipping, and intelligent warehousing.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/track" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                <Package className="h-5 w-5" />
                                Track Shipment
                            </Link>
                            <Link to="/quote" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                Get a Quote
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tracking Quick Access */}
            <section className="bg-white py-24 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
                        <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                                <Zap className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Swift courier services optimized for the last-mile economy.</p>
                        </div>
                        <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                                <Globe className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Cross-Border</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Economical international shipping with customs handling.</p>
                        </div>
                        <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                                <Shield className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Secured Warehousing</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Fulfilled and managed inventory for scaling businesses.</p>
                        </div>
                        <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                                <Clock className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Real-time Vision</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Full shipment lifecycle visibility in one single dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
