import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from './components/Layout/AppShell';
import PageTransition from './components/Layout/PageTransition';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Journal from './pages/Journal';
import FearBuster from './pages/FearBuster';
import FocusMode from './pages/FocusMode';

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/tasks" element={<PageTransition><Tasks /></PageTransition>} />
          <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
          <Route path="/fear-buster" element={<PageTransition><FearBuster /></PageTransition>} />
          <Route path="/focus" element={<PageTransition><FocusMode /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
