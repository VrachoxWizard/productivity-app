import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from '@/components/Layout/AppShell';
import { AuthProvider, useAuth } from '@/components/Auth/AuthContext';
import Login from '@/pages/Login';

// Lazy load pages for performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Journal = lazy(() => import('@/pages/Journal'));
const FearBuster = lazy(() => import('@/pages/FearBuster'));
const FocusMode = lazy(() => import('@/pages/FocusMode'));

// Lightweight loading state
const PageLoader = () => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
    <div className="sidebar__logo" style={{ width: 40, height: 40 }} />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/fear-buster" element={<FearBuster />} />
                    <Route path="/focus" element={<FocusMode />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
