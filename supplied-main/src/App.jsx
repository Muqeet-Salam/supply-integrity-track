import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// Pages
import HomePage from './pages/HomePage';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import ConsumerVerification from './pages/ConsumerVerification';
import VerifyPage from './pages/VerifyPage';
import DashboardLayout from './layouts/DashboardLayout';
import ConsumerDashboard from './pages/ConsumerDashboard';

import ManufacturerLogin from './pages/ManufacturerLogin';
import DistributorLogin from './pages/DistributorLogin';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-dark-200">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/verify" element={<VerifyPage />} />
            
            {/* Role-based Dashboards */}
            <Route path="/manufacturer" element={<ManufacturerDashboard />} />
            <Route path="/distributor" element={<DistributorDashboard />} />
            <Route path="/retailer" element={<RetailerDashboard />} />

            {/* Login pages for manufacturer/distributor (placeholders) */}
            <Route path="/manufacturer-login" element={<ManufacturerLogin />} />
            <Route path="/distributor-login" element={<DistributorLogin />} />
            
            {/* Consumer Routes (wrapped in dashboard layout) */}
            <Route path="/consumer-dashboard" element={<DashboardLayout />}>
              <Route index element={<ConsumerDashboard />} />
              <Route path=":batchId" element={<ConsumerVerification />} />
            </Route>
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#e2e8f0',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#e2e8f0',
                },
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
