import { Link } from 'react-router-dom';
import NaoLogo from '../common/NaoLogo';
import { Package, Search, User, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-10">
                        <Link to="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
                            <NaoLogo className="h-16" />
                        </Link>
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-tight text-slate-600">
                            <Link to="/track" className="hover:text-primary transition-colors">Track</Link>
                            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
                            <Link to="/locations" className="hover:text-primary transition-colors">Locations</Link>
                            <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200 group focus-within:border-accent-orange transition-all">
                            <Search className="h-4 w-4 text-slate-400 mr-2 group-focus-within:text-accent-orange" />
                            <input 
                                type="text" 
                                placeholder="Tracking Number" 
                                className="bg-transparent border-none outline-none text-xs w-32 focus:w-48 transition-all font-medium text-slate-700"
                            />
                        </div>
                        <Link to="/login" className="flex items-center gap-2 bg-accent-orange text-white px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-tight hover:brightness-110 hover:shadow-lg hover:shadow-orange-200 transition-all">
                            <User className="h-4 w-4" />
                            <span>Sign In</span>
                        </Link>
                        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
