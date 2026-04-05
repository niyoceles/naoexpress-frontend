import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Users, Search, Loader2, ShieldCheck, Briefcase, User as UserIcon,
    Truck, Warehouse, Headphones, Plus, Pencil, Trash2, Ban,
    CheckCircle2, X, AlertTriangle, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
    { value: 'admin',        label: 'Admin',              icon: ShieldCheck, color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { value: 'merchant',     label: 'Merchant',           icon: Briefcase,   color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { value: 'customer',     label: 'Customer',           icon: UserIcon,    color: 'bg-slate-50 text-slate-700 border-slate-200' },
    { value: 'courier',      label: 'Courier',            icon: Truck,       color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { value: 'warehouse_op', label: 'Warehouse Operator', icon: Warehouse,   color: 'bg-green-50 text-green-700 border-green-100' },
    { value: 'support',      label: 'Support Agent',      icon: Headphones,  color: 'bg-rose-50 text-rose-700 border-rose-100' },
];

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.value, r]));

const EMPTY_FORM = { name: '', email: '', password: '', role: 'customer', phone: '' };

// ─── Slide-Over Drawer ────────────────────────────────────────────────────────

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    editUser: any | null;
    onSaved: () => void;
}

const UserDrawer: React.FC<DrawerProps> = ({ open, onClose, editUser, onSaved }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editUser) {
            setForm({ name: editUser.name, email: editUser.email, password: '', role: editUser.role, phone: editUser.phone || '' });
        } else {
            setForm(EMPTY_FORM);
        }
        setError('');
    }, [editUser, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editUser) {
                const payload: any = { name: form.name, email: form.email, role: form.role, phone: form.phone };
                await api.put(`/admin/users/${editUser._id}`, payload);
            } else {
                await api.post('/admin/users', form);
            }
            onSaved();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx('fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0 pointer-events-none')}
                onClick={onClose}
            />
            {/* Drawer */}
            <div className={clsx(
                'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out',
                open ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{editUser ? 'Edit User' : 'Create New User'}</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{editUser ? `Editing ${editUser.name}` : 'Add a new user to the system'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name *</label>
                        <input
                            required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="John Doe"
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address *</label>
                        <input
                            required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="user@example.com"
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
                        />
                    </div>

                    {/* Password — only required for create */}
                    {!editUser && (
                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Password *</label>
                            <div className="relative">
                                <input
                                    required={!editUser}
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone (optional)</label>
                        <input
                            type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+1 234 567 8901"
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Role *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLES.map(role => {
                                const Icon = role.icon;
                                const selected = form.role === role.value;
                                return (
                                    <button
                                        key={role.value} type="button"
                                        onClick={() => setForm(p => ({ ...p, role: role.value }))}
                                        className={clsx(
                                            'flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-xs font-bold text-left transition',
                                            selected ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        {role.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 flex items-center gap-3">
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit as any}
                        disabled={saving}
                        className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editUser ? 'Save Changes' : 'Create User'}
                    </button>
                </div>
            </div>
        </>
    );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmClass: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className={clsx('flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50', confirmClass)}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    // Action state
    const [actionUser, setActionUser] = useState<any | null>(null);
    const [actionType, setActionType] = useState<'delete' | 'toggle' | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const fetchUsers = useCallback(async (searchTerm = search) => {
        setLoading(true);
        try {
            const params: any = { limit: 100 };
            if (roleFilter) params.role = roleFilter;
            if (searchTerm.trim()) params.search = searchTerm.trim();
            const res = await api.get('/admin/users', { params });
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to load users', err);
        } finally {
            setLoading(false);
        }
    }, [roleFilter]);

    // Fire on role filter change immediately
    useEffect(() => { fetchUsers(''); }, [fetchUsers]);

    // Debounce search input — waits 400ms after last keystroke
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers(search);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search]);

    // `users` is already filtered by the server — no client-side filtering needed
    const filtered = users;

    const openCreate = () => { setEditingUser(null); setDrawerOpen(true); };
    const openEdit   = (user: any) => { setEditingUser(user); setDrawerOpen(true); };

    const confirmToggle = (user: any) => { setActionUser(user); setActionType('toggle'); };
    const confirmDelete = (user: any) => { setActionUser(user); setActionType('delete'); };

    const handleAction = async () => {
        if (!actionUser || !actionType) return;
        setActionLoading(true);
        try {
            if (actionType === 'delete') {
                await api.delete(`/admin/users/${actionUser._id}`);
                showToast(`${actionUser.name} has been permanently deleted.`);
            } else {
                const res = await api.patch(`/admin/users/${actionUser._id}/toggle-status`);
                showToast(res.data.message);
            }
            fetchUsers();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Action failed.');
        } finally {
            setActionLoading(false);
            setActionUser(null);
            setActionType(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-bottom-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">User Management</h1>
                    <p className="text-slate-500">{users.length} registered accounts in the system</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => fetchUsers(search)} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-500">
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={openCreate}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-blue-100"
                    >
                        <Plus className="h-4 w-4" /> New User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-primary text-sm transition"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All Roles</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">User</th>
                                <th className="px-8 py-4">Role</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Joined</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No users found</p>
                                    </td>
                                </tr>
                            ) : filtered.map(user => {
                                const roleInfo = ROLE_MAP[user.role];
                                const RoleIcon = roleInfo?.icon || UserIcon;
                                return (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    'w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
                                                    user.isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                                                )}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-400">{user.email}</div>
                                                    {user.phone && <div className="text-xs text-slate-400">{user.phone}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={clsx(
                                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                                roleInfo?.color || 'bg-slate-50 text-slate-600 border-slate-200'
                                            )}>
                                                <RoleIcon className="h-3 w-3" />
                                                {roleInfo?.label || user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={clsx(
                                                'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                                user.isActive
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-red-50 text-red-500 border-red-100'
                                            )}>
                                                {user.isActive ? '● Active' : '○ Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500 font-mono">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                                    title="Edit user"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                {/* Suspend / Activate */}
                                                <button
                                                    onClick={() => confirmToggle(user)}
                                                    className={clsx('p-2 rounded-xl transition', user.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50')}
                                                    title={user.isActive ? 'Suspend user' : 'Activate user'}
                                                >
                                                    {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Drawer */}
            <UserDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                editUser={editingUser}
                onSaved={() => { fetchUsers(); showToast(editingUser ? 'User updated successfully.' : 'User created successfully.'); }}
            />

            {/* Confirm: Suspend / Activate */}
            <ConfirmDialog
                open={!!actionUser && actionType === 'toggle'}
                title={actionUser?.isActive ? `Suspend ${actionUser?.name}?` : `Activate ${actionUser?.name}?`}
                message={actionUser?.isActive
                    ? 'This user will lose access to the platform immediately. You can re-activate them at any time.'
                    : 'This user will regain full access according to their role permissions.'}
                confirmLabel={actionUser?.isActive ? 'Yes, Suspend' : 'Yes, Activate'}
                confirmClass={actionUser?.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}
                onConfirm={handleAction}
                onCancel={() => { setActionUser(null); setActionType(null); }}
                loading={actionLoading}
            />

            {/* Confirm: Delete */}
            <ConfirmDialog
                open={!!actionUser && actionType === 'delete'}
                title={`Delete ${actionUser?.name}?`}
                message="This action is permanent and cannot be undone. All associated data will remain but the user account will be removed."
                confirmLabel="Yes, Delete Permanently"
                confirmClass="bg-red-500 hover:bg-red-600"
                onConfirm={handleAction}
                onCancel={() => { setActionUser(null); setActionType(null); }}
                loading={actionLoading}
            />
        </div>
    );
};

export default AdminUsers;
