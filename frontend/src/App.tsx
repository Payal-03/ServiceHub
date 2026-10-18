import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerRequestsPage } from './pages/customer/CustomerRequestsPage';
import { CreateRequestPage } from './pages/customer/CreateRequestPage';
import { ElectricianJobsPage } from './pages/electrician/ElectricianJobsPage';
import { ElectricianMyJobsPage } from './pages/electrician/ElectricianMyJobsPage';
import { ElectricianProfilePage } from './pages/electrician/ElectricianProfilePage';
import { RequestDetailsPage } from './pages/RequestDetailsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Customer Routes */}
                <Route
                  path="/customer/requests"
                  element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                      <CustomerRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/create-request"
                  element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                      <CreateRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/post-job"
                  element={<Navigate to="/customer/create-request" replace />}
                />
                <Route
                  path="/customer/dashboard"
                  element={<Navigate to="/customer/requests" replace />}
                />

                {/* Electrician Routes */}
                <Route
                  path="/electrician/jobs"
                  element={
                    <ProtectedRoute allowedRole="ELECTRICIAN">
                      <ElectricianJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/electrician/my-jobs"
                  element={
                    <ProtectedRoute allowedRole="ELECTRICIAN">
                      <ElectricianMyJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/electrician/profile"
                  element={
                    <ProtectedRoute allowedRole="ELECTRICIAN">
                      <ElectricianProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Provider Aliases (for backward compatibility) */}
                <Route
                  path="/provider/requests"
                  element={<Navigate to="/electrician/jobs" replace />}
                />
                <Route
                  path="/provider/dashboard"
                  element={<Navigate to="/electrician/jobs" replace />}
                />
                <Route
                  path="/provider/profile"
                  element={<Navigate to="/electrician/profile" replace />}
                />

                {/* Request Details (Available to both Customer & Electrician) */}
                <Route
                  path="/requests/:id"
                  element={
                    <ProtectedRoute>
                      <RequestDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
