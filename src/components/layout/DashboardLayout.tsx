import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Bell, Search, Settings } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const DashboardLayout = () => {
    const { name, logout } = useAuth();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-grow flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 transition-all">
                    <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                        <Search className="h-4 w-4 text-slate-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Search shipments, invoices, or help..." 
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

                        <Link 
                            to="/profile"
                            className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100"
                        >
                            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                                {initials || '??'}
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-primary transition-colors">{name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Profile</div>
                            </div>
                        </Link>
                    </div>
                </header>
                
                <main className="flex-grow overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
