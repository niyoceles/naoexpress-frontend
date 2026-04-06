import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import useAuth from './hooks/useAuth';

// ── Public ──────────────────────────────────────────────────────────────────
const Home         = lazy(() => import('./pages/public/Home'));
const Track        = lazy(() => import('./pages/public/Track'));
const Services     = lazy(() => import('./pages/public/Services'));
const Locations    = lazy(() => import('./pages/public/Locations'));
const GuestSupport = lazy(() => import('./pages/public/ContactUs'));

// ── Auth ─────────────────────────────────────────────────────────────────────
const Login = lazy(() => import('./pages/auth/Login'));

// ── Customer ─────────────────────────────────────────────────────────────────
const DashboardHome    = lazy(() => import('./pages/dashboard/DashboardHome'));
const ShipmentsList    = lazy(() => import('./pages/dashboard/ShipmentsList'));
const NewShipment      = lazy(() => import('./pages/dashboard/NewShipment'));
const SupportCenter    = lazy(() => import('./pages/dashboard/SupportCenter'));
const ShipmentDetails  = lazy(() => import('./pages/dashboard/ShipmentDetails'));
const Profile          = lazy(() => import('./pages/dashboard/Profile'));
const SupportTickets   = lazy(() => import('./pages/dashboard/SupportTickets'));

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));
const AdminShipments = lazy(() => import('./pages/admin/AdminShipments'));

// ── Courier ───────────────────────────────────────────────────────────────────
const CourierDashboard = lazy(() => import('./pages/operations/courier/CourierDashboard'));
const ActiveDelivery   = lazy(() => import('./pages/operations/courier/ActiveDelivery'));

// ── Warehouse ─────────────────────────────────────────────────────────────────
const WarehouseDashboard = lazy(() => import('./pages/operations/warehouse/WarehouseDashboard'));
const IncomingQueue      = lazy(() => import('./pages/operations/warehouse/IncomingQueue'));
const OutgoingQueue      = lazy(() => import('./pages/operations/warehouse/OutgoingQueue'));

// ── Support ───────────────────────────────────────────────────────────────────
const SupportDashboard = lazy(() => import('./pages/operations/support/SupportDashboard'));
const ShipmentSearch   = lazy(() => import('./pages/operations/support/ShipmentSearch'));
const ComplaintsManagement = lazy(() => import('./pages/operations/support/ComplaintsManagement'));
const ContactManagement = lazy(() => import('./pages/operations/support/ContactManagement'));

// ── Guards ───────────────────────────────────────────────────────────────────

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const RoleGuard = ({ children, allowed }: { children: React.ReactNode; allowed: string[] }) => {
    const { role } = useAuth();
    // Admin can access every route
    if (role === 'admin' || allowed.includes(role)) return <>{children}</>;
    return <Navigate to="/login" replace />;
};

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/track" element={<Track />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/support" element={<GuestSupport />} />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<Login />} />

                {/* ── Customer Dashboard ─────────────────── */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><RoleGuard allowed={['customer']}><DashboardLayout /></RoleGuard></ProtectedRoute>
                }>
                    <Route index element={<DashboardHome />} />
                    <Route path="shipments" element={<ShipmentsList />} />
                    <Route path="shipments/new" element={<NewShipment />} />
                    <Route path="shipments/:id" element={<ShipmentDetails />} />
                    <Route path="support" element={<SupportCenter />} />
                    <Route path="support/tickets" element={<SupportTickets />} />
                </Route>

                {/* ── Admin Portal ───────────────────────── */}
                <Route path="/admin" element={
                    <ProtectedRoute><RoleGuard allowed={['admin']}><DashboardLayout /></RoleGuard></ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="customers" element={<AdminUsers />} />
                    <Route path="shipments" element={<AdminShipments />} />
                </Route>

                {/* ── Courier Portal ─────────────────────── */}
                <Route path="/ops/courier" element={
                    <ProtectedRoute><RoleGuard allowed={['courier']}><DashboardLayout /></RoleGuard></ProtectedRoute>
                }>
                    <Route index element={<CourierDashboard />} />
                    <Route path="deliveries" element={<ActiveDelivery />} />
                    <Route path="completed" element={<ActiveDelivery />} />
                </Route>

                {/* ── Warehouse Portal ───────────────────── */}
                <Route path="/ops/warehouse" element={
                    <ProtectedRoute><RoleGuard allowed={['warehouse_op']}><DashboardLayout /></RoleGuard></ProtectedRoute>
                }>
                    <Route index element={<WarehouseDashboard />} />
                    <Route path="incoming" element={<IncomingQueue />} />
                    <Route path="outgoing" element={<OutgoingQueue />} />
                </Route>

                {/* ── Support Portal ─────────────────────── */}
                <Route path="/ops/support" element={
                    <ProtectedRoute><RoleGuard allowed={['support']}><DashboardLayout /></RoleGuard></ProtectedRoute>
                }>
                    <Route index element={<SupportDashboard />} />
                    <Route path="search" element={<ShipmentSearch />} />
                    <Route path="complaints" element={<ComplaintsManagement />} />
                    <Route path="contacts" element={<ContactManagement />} />
                    <Route path="escalations" element={<SupportDashboard />} />
                </Route>

                {/* Shared Profile */}
                <Route path="/profile" element={
                    <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                    <Route index element={<Profile />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
