import { Link } from 'react-router-dom';
import NaoLogo from '../common/NaoLogo';
import { Package, Search, User, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/">
                            <NaoLogo className="h-10" />
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                            <Link to="/track" className="hover:text-primary transition">Track</Link>
                            <Link to="/services" className="hover:text-primary transition">Services</Link>
                            <Link to="/locations" className="hover:text-primary transition">Locations</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
                            <Search className="h-4 w-4 text-slate-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Tracking #" 
                                className="bg-transparent border-none outline-none text-xs w-24 focus:w-32 transition-all"
                            />
                        </div>
                        <Link to="/login" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition">
                            <User className="h-4 w-4" />
                            <span>Sign In</span>
                        </Link>
                        <button className="md:hidden p-2 text-slate-600">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
