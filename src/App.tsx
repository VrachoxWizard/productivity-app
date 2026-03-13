import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from '@/components/Layout/AppShell';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Journal from '@/pages/Journal';
import FearBuster from '@/pages/FearBuster';
import FocusMode from '@/pages/FocusMode';

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/fear-buster" element={<FearBuster />} />
        <Route path="/focus" element={<FocusMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
