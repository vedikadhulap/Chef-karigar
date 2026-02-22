
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Job, StaffMember, MatchBundle, AgencyRole } from './types';
import { BusinessView } from './components/BusinessView';
import { StaffView } from './components/StaffView';
import { AgencyView } from './components/AgencyView';
import { ExternalSalesView } from './components/ExternalSalesView';
import { LoginView } from './components/LoginView';
import { AgencyLoginView } from './components/AgencyLoginView';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MOCK_JOBS, MOCK_STAFF, MOCK_MATCH_BUNDLES } from './constants';
import { useOfflineSync } from './hooks/useOfflineSync';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [matchBundles, setMatchBundles] = useState<MatchBundle[]>(MOCK_MATCH_BUNDLES);

  // Global offline sync — any queued action (job post, hire, referral) will
  // auto-flush when the device comes back online.
  const { isOnline, queueLength } = useOfflineSync(async (items) => {
    // In production: call the real API here for each pending item
    console.log('[OfflineSync] Flushing', items.length, 'queued items:', items);
  });

  const handleJobPosted = (newJob: Job) => {
      setJobs(prev => [newJob, ...prev]);
  };

  const handleStaffAdded = (newStaff: StaffMember) => {
      setStaff(prev => [newStaff, ...prev]);
  };

  const handleUpdateMatchBundles = (bundles: MatchBundle[]) => {
      setMatchBundles(bundles);
  };

  const getAgencyRole = (): AgencyRole => {
    return (localStorage.getItem('agencyRole') as AgencyRole) || 'SUPPORT';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Business Routes */}
          <Route path="/business/login" element={<LoginView role="BUSINESS" />} />
          <Route 
            path="/business/dashboard" 
            element={
              <ProtectedRoute requiredRole="BUSINESS">
                <BusinessView 
                  jobs={jobs} 
                  onJobPosted={handleJobPosted} 
                  matchBundles={matchBundles} 
                  staffList={staff}
                  onUpdateMatchBundles={handleUpdateMatchBundles}
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Staff Routes */}
          <Route path="/staff/login" element={<LoginView role="STAFF" />} />
          <Route 
            path="/staff/dashboard" 
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffView jobs={jobs} onStaffAdded={handleStaffAdded} />
              </ProtectedRoute>
            } 
          />
          
          {/* Sales Partner Routes */}
          <Route 
            path="/sales/dashboard" 
            element={
              <ExternalSalesView jobs={jobs} onStaffAdded={handleStaffAdded} initialView="home" />
            } 
          />
          <Route 
            path="/sales/nearby" 
            element={
              <ExternalSalesView jobs={jobs} onStaffAdded={handleStaffAdded} initialView="nearby" />
            } 
          />
          
          {/* Agency Routes */}
          <Route path="/agency/login" element={<AgencyLoginView />} />
          <Route 
            path="/agency/:role" 
            element={
              <ProtectedRoute requiredRole="AGENCY">
                <AgencyView 
                  role={getAgencyRole()} 
                  jobs={jobs} 
                  staffList={staff} 
                  setStaffList={setStaff} 
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
