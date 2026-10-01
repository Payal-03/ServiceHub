import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import { PublicLayout } from '../components/layout/PublicLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute, RoleProtectedRoute } from './ProtectedRoute';

// Lazy-loaded Public Pages
const LandingPage = lazy(() => import('../pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const HowItWorksPage = lazy(() => import('../pages/public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const BecomeProviderPage = lazy(() => import('../pages/public/BecomeProviderPage').then(m => ({ default: m.BecomeProviderPage })));
const ForbiddenPage = lazy(() => import('../pages/public/ForbiddenPage').then(m => ({ default: m.ForbiddenPage })));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Lazy-loaded Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// Lazy-loaded Customer Pages
const CustomerDashboardPage = lazy(() => import('../pages/customer/CustomerDashboardPage').then(m => ({ default: m.CustomerDashboardPage })));
const CustomerRequestsPage = lazy(() => import('../pages/customer/CustomerRequestsPage').then(m => ({ default: m.CustomerRequestsPage })));
const CustomerRequestDetailsPage = lazy(() => import('../pages/customer/CustomerRequestDetailsPage').then(m => ({ default: m.CustomerRequestDetailsPage })));
const ServiceDiscoveryPage = lazy(() => import('../pages/customer/ServiceDiscoveryPage').then(m => ({ default: m.ServiceDiscoveryPage })));
const ProviderProfilePage = lazy(() => import('../pages/customer/ProviderProfilePage').then(m => ({ default: m.ProviderProfilePage })));
const BookServicePage = lazy(() => import('../pages/customer/BookServicePage').then(m => ({ default: m.BookServicePage })));
const CustomerBookingsPage = lazy(() => import('../pages/customer/CustomerBookingsPage').then(m => ({ default: m.CustomerBookingsPage })));
const BookingDetailsPage = lazy(() => import('../pages/customer/BookingDetailsPage').then(m => ({ default: m.BookingDetailsPage })));
const CustomerPaymentsPage = lazy(() => import('../pages/customer/CustomerPaymentsPage').then(m => ({ default: m.CustomerPaymentsPage })));
const CustomerReviewsPage = lazy(() => import('../pages/customer/CustomerReviewsPage').then(m => ({ default: m.CustomerReviewsPage })));
const CustomerProfilePage = lazy(() => import('../pages/customer/CustomerProfilePage').then(m => ({ default: m.CustomerProfilePage })));
const CustomerSettingsPage = lazy(() => import('../pages/customer/CustomerSettingsPage').then(m => ({ default: m.CustomerSettingsPage })));

// Lazy-loaded Provider Pages
const ProviderDashboardPage = lazy(() => import('../pages/provider/ProviderDashboardPage').then(m => ({ default: m.ProviderDashboardPage })));
const ProviderRequestsPage = lazy(() => import('../pages/provider/ProviderRequestsPage').then(m => ({ default: m.ProviderRequestsPage })));
const ProviderBookingsPage = lazy(() => import('../pages/provider/ProviderBookingsPage').then(m => ({ default: m.ProviderBookingsPage })));
const ProviderBookingDetailsPage = lazy(() => import('../pages/provider/ProviderBookingDetailsPage').then(m => ({ default: m.ProviderBookingDetailsPage })));
const ProviderServicesPage = lazy(() => import('../pages/provider/ProviderServicesPage').then(m => ({ default: m.ProviderServicesPage })));
const ProviderAvailabilityPage = lazy(() => import('../pages/provider/ProviderAvailabilityPage').then(m => ({ default: m.ProviderAvailabilityPage })));
const ProviderServiceAreasPage = lazy(() => import('../pages/provider/ProviderServiceAreasPage').then(m => ({ default: m.ProviderServiceAreasPage })));
const ProviderEarningsPage = lazy(() => import('../pages/provider/ProviderEarningsPage').then(m => ({ default: m.ProviderEarningsPage })));
const ProviderReviewsPage = lazy(() => import('../pages/provider/ProviderReviewsPage').then(m => ({ default: m.ProviderReviewsPage })));
const ProviderProfileEditPage = lazy(() => import('../pages/provider/ProviderProfileEditPage').then(m => ({ default: m.ProviderProfileEditPage })));
const ProviderSettingsPage = lazy(() => import('../pages/provider/ProviderSettingsPage').then(m => ({ default: m.ProviderSettingsPage })));

// Lazy-loaded Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminProvidersListPage = lazy(() => import('../pages/admin/AdminProvidersListPage').then(m => ({ default: m.AdminProvidersListPage })));
const AdminProviderVerificationPage = lazy(() => import('../pages/admin/AdminProviderVerificationPage').then(m => ({ default: m.AdminProviderVerificationPage })));
const AdminServicesPage = lazy(() => import('../pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })));
const AdminBookingsPage = lazy(() => import('../pages/admin/AdminBookingsPage').then(m => ({ default: m.AdminBookingsPage })));
const AdminComplaintsPage = lazy(() => import('../pages/admin/AdminComplaintsPage').then(m => ({ default: m.AdminComplaintsPage })));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-neutral-400 tracking-wide uppercase">
      Loading ServiceHub...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServiceDiscoveryPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/become-provider" element={<BecomeProviderPage />} />
        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/customer"
          element={
            <RoleProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <AppLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="requests" element={<CustomerRequestsPage />} />
          <Route path="requests/:id" element={<CustomerRequestDetailsPage />} />
          <Route path="post-request" element={<BookServicePage />} />
          <Route path="services" element={<ServiceDiscoveryPage />} />
          <Route path="providers" element={<ServiceDiscoveryPage />} />
          <Route path="providers/:id" element={<ProviderProfilePage />} />
          <Route path="book-service" element={<BookServicePage />} />
          <Route path="book-service/:providerId" element={<BookServicePage />} />
          <Route path="bookings" element={<CustomerRequestsPage />} />
          <Route path="bookings/:id" element={<BookingDetailsPage />} />
          <Route path="payments" element={<CustomerPaymentsPage />} />
          <Route path="reviews" element={<CustomerReviewsPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
        </Route>

        {/* ================= PROVIDER ROUTES ================= */}
        <Route
          path="/provider"
          element={
            <RoleProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
              <AppLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="requests" element={<ProviderRequestsPage />} />
          <Route path="bookings" element={<ProviderBookingsPage />} />
          <Route path="bookings/:id" element={<ProviderBookingDetailsPage />} />
          <Route path="services" element={<ProviderServicesPage />} />
          <Route path="availability" element={<ProviderAvailabilityPage />} />
          <Route path="service-areas" element={<ProviderServiceAreasPage />} />
          <Route path="earnings" element={<ProviderEarningsPage />} />
          <Route path="reviews" element={<ProviderReviewsPage />} />
          <Route path="profile" element={<ProviderProfileEditPage />} />
          <Route path="settings" element={<ProviderSettingsPage />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AppLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="providers" element={<AdminProvidersListPage />} />
          <Route path="provider-verification" element={<AdminProviderVerificationPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ================= SYSTEM / ERROR ROUTES ================= */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
