import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    LayoutDashboard, Package, PlusCircle, Search, LogOut, Truck,
    CreditCard, Upload, BarChart3, Users, ShieldCheck, Briefcase,
    Warehouse, Headphones, MapPin, ClipboardList, ArrowRight,
    CheckCircle2, AlertCircle, FileSearch, Inbox, Send, User, Calculator, Activity
} from 'lucide-react';
import NaoLogo from '../common/NaoLogo';
import useAuth from '../../hooks/useAuth';

// ─── Role-specific navigation maps ───────────────────────────────────────────

const CUSTOMER_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'My Shipments', path: '/dashboard/shipments' },
    { icon: PlusCircle, label: 'Ship New Parcel', path: '/dashboard/shipments/new' },
    { icon: Search, label: 'Track Package', path: '/track' },
];

const COURIER_NAV = [
    { icon: LayoutDashboard, label: 'My Dashboard', path: '/ops/courier' },
    { icon: Truck, label: 'Active Deliveries', path: '/ops/courier/deliveries' },
    { icon: CheckCircle2, label: 'Completed', path: '/ops/courier/completed' },
    { icon: Search, label: 'Track Package', path: '/track' },
];

const WAREHOUSE_NAV = [
    { icon: LayoutDashboard, label: 'Hub Overview', path: '/ops/warehouse' },
    { icon: Inbox, label: 'Incoming Queue', path: '/ops/warehouse/incoming' },
    { icon: Send, label: 'Outgoing Dispatch', path: '/ops/warehouse/outgoing' },
    { icon: Package, label: 'Inventory List', path: '/ops/warehouse/inventory' },
    { icon: Activity, label: 'My Tasks', path: '/ops/warehouse/tasks' },
    { icon: PlusCircle, label: 'Receive Goods', path: '/ops/warehouse/stock-in' },
];

const SUPPORT_NAV = [
    { icon: LayoutDashboard, label: 'Support Dashboard', path: '/ops/support' },
    { icon: FileSearch, label: 'Search Shipments', path: '/ops/support/search' },
    { icon: AlertCircle, label: 'Complaints Hub', path: '/ops/support/complaints' },
    { icon: AlertCircle, label: 'Escalations', path: '/ops/support/escalations' },
];

const ADMIN_NAV = [
    // Core Admin
    { section: 'Admin Control', items: [
        { icon: ShieldCheck, label: 'Overview', path: '/admin' },
        { icon: Users, label: 'User Management', path: '/admin/customers' },
        { icon: AlertCircle, label: 'Customer Complaints', path: '/ops/support/complaints' },
        { icon: Package, label: 'All Shipments', path: '/admin/shipments' },
        { icon: Warehouse, label: 'System Inventory', path: '/ops/warehouse/inventory' },
    ]},
    // Customer Portal
    { section: 'Customer Portal', items: [
        { icon: LayoutDashboard, label: 'Customer Home', path: '/dashboard' },
        { icon: PlusCircle, label: 'Create Shipment', path: '/dashboard/shipments/new' },
    ]},
    // Operations
    { section: 'Operations', items: [
        { icon: Truck, label: 'Courier Portal', path: '/ops/courier' },
        { icon: Warehouse, label: 'Warehouse Hub', path: '/ops/warehouse' },
        { icon: Package, label: 'Receive Goods', path: '/ops/warehouse/stock-in' },
        { icon: Headphones, label: 'Support Desk', path: '/ops/support' },
    ]},
];

// ─── Nav Item Component ───────────────────────────────────────────────────────

const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <NavLink
        to={path}
        end={path.split('/').length <= 2}
        className={({ isActive }) => clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
            isActive ? 'bg-primary text-white shadow-lg shadow-blue-900/40' : 'hover:text-white hover:bg-slate-800'
        )}
    >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {label}
    </NavLink>
);

// ─── Role badge display ───────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
    admin:        'bg-purple-500/20 text-purple-300',
    customer:     'bg-slate-700 text-slate-300',
    courier:      'bg-amber-500/20 text-amber-300',
    warehouse_op: 'bg-green-500/20 text-green-300',
    support:      'bg-rose-500/20 text-rose-300',
};

const ROLE_LABELS: Record<string, string> = {
    admin:        'System Admin',
    customer:     'Customer',
    courier:      'Courier',
    warehouse_op: 'Warehouse Op',
    support:      'Support Agent',
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

const Sidebar = () => {
    const { role, name, logout } = useAuth();

    const renderNav = () => {
        if (role === 'admin') {
            return (
                <nav className="flex-grow space-y-6 overflow-y-auto">
                    {ADMIN_NAV.map((section) => (
                        <div key={section.section}>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-4 mb-2">
                                {section.section}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavItem key={item.path} {...item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            );
        }

        const navMap: Record<string, typeof CUSTOMER_NAV> = {
            customer:     CUSTOMER_NAV,
            courier:      COURIER_NAV,
            warehouse_op: WAREHOUSE_NAV,
            support:      SUPPORT_NAV,
        };

        const items = navMap[role] || CUSTOMER_NAV;

        return (
            <nav className="flex-grow space-y-1">
                {items.map((item) => (
                    <NavItem key={item.path} {...item} />
                ))}
            </nav>
        );
    };

    return (
        <aside className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col p-5 text-slate-400 overflow-y-auto">
            <div className="flex items-center gap-2 mb-12 px-2">
                <NaoLogo className="h-20 shadow-xl" />
            </div>

            {/* User identity chip */}
            <div className="flex items-center gap-3 px-3 py-3 bg-slate-800 rounded-2xl mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{name}</div>
                    <div className={clsx('text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 inline-block', ROLE_COLORS[role])}>
                        {ROLE_LABELS[role] || role}
                    </div>
                </div>
                <NavLink to="/profile" className="ml-auto p-2 bg-slate-700 hover:bg-primary hover:text-white rounded-xl transition shadow-sm group">
                    <User className="h-4 w-4 scale-110 group-hover:scale-125 transition" />
                </NavLink>
            </div>

            {/* Nav */}
            {renderNav()}

            {/* Bottom */}
            <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
