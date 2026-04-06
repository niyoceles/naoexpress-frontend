import React from 'react';
import { ArrowRight, Globe, Shield, Zap, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-52">
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100 rounded-full blur-[120px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-block px-5 py-2 rounded-full bg-orange-100 text-accent-orange text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                            Fast & Reliable Delivery
                        </span>
                        <h1 className="text-6xl lg:text-8xl font-black text-primary tracking-tight mb-10 leading-[0.95]">
                            Deliver <span className="text-accent-orange italic">Anything,</span> <br className="hidden lg:block"/> Anywhere.
                        </h1>
                        <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            Premium door-to-door delivery and cross-border logistics, driven by intelligence and speed.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/track" className="w-full sm:w-auto bg-accent-orange text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-tight hover:brightness-110 hover:shadow-2xl hover:shadow-orange-200 transition-all flex items-center justify-center gap-3 active:scale-95 transform">
                                <Package className="h-6 w-6" />
                                Track Shipment
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 transform">
                                Sign In
                                <ArrowRight className="h-6 w-6" />
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
