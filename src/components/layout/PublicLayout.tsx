import React from 'react';
import Navbar from './Navbar';
import NaoLogo from '../common/NaoLogo';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <NaoLogo className="h-8 text-white" />
                    <div className="flex gap-8 text-sm">
                        <a href="/about" className="hover:text-white transition">About</a>
                        <a href="/services" className="hover:text-white transition">Services</a>
                        <a href="/locations" className="hover:text-white transition">Locations</a>
                        <a href="/terms" className="hover:text-white transition">Terms</a>
                    </div>
                    <div className="text-xs">
                        &copy; 2024 NAO Express Logistics. Managed by the System.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
