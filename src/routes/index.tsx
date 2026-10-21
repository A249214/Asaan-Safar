import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PrivateRoute } from '@/routes/PrivateRoute';
import { UserRole } from '@/types/auth.types';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const RoutesPage = lazy(() => import('@/pages/public/RoutesPage'));
const LiveTrackingPage = lazy(() => import('@/pages/public/LiveTrackingPage'));
const BookingPage = lazy(() => import('@/pages/public/BookingPage'));
const TicketPage = lazy(() => import('@/pages/public/TicketPage'));
const FindBookingPage = lazy(() => import('@/pages/public/FindBookingPage'));
const PublicVerificationPage = lazy(() => import('@/pages/public/PublicVerificationPage'));
const MyBookingsPage = lazy(() => import('@/pages/public/MyBookingsPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const RoutesManagementPage = lazy(() => import('@/pages/admin/RoutesManagementPage'));
const BookingsManagementPage = lazy(() => import('@/pages/admin/BookingsManagementPage'));
const TerminalOperationsPage = lazy(() => import('@/pages/admin/TerminalOperationsPage'));
const FleetPage = lazy(() => import('@/pages/admin/FleetPage'));
const MaintenancePage = lazy(() => import('@/pages/admin/MaintenancePage'));
const AuditPage = lazy(() => import('@/pages/admin/AuditPage'));
const TicketVerificationPage = lazy(() => import('@/pages/conductor/TicketVerificationPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

const adminRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER];
const conductorRoles = [UserRole.CONDUCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN];

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="tracking" element={<LiveTrackingPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="ticket" element={<TicketPage />} />
          <Route path="ticket/:pnrOrId" element={<TicketPage />} />
          <Route path="find-booking" element={<FindBookingPage />} />
          <Route path="verify-ticket" element={<PublicVerificationPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        <Route element={<PrivateRoute allowedRoles={adminRoles} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<DashboardPage />} />
            <Route path="admin/routes" element={<RoutesManagementPage />} />
            <Route path="admin/fleet" element={<FleetPage />} />
            <Route path="admin/bookings" element={<BookingsManagementPage />} />
            <Route path="admin/terminals" element={<TerminalOperationsPage />} />
            <Route path="admin/maintenance" element={<MaintenancePage />} />
            <Route path="admin/audit" element={<AuditPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={conductorRoles} />}>
          <Route element={<AdminLayout />}>
            <Route path="conductor" element={<TicketVerificationPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
