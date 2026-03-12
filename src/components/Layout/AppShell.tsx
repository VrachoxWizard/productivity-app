import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import type { ModuleAccent } from '../../types';
import './AppShell.css';

const accentMap: Record<string, ModuleAccent> = {
  '/': 'dashboard',
  '/tasks': 'tasks',
  '/journal': 'journal',
  '/fear-buster': 'fear-buster',
  '/focus': 'focus',
};

function setAccentVars(accent: ModuleAccent) {
  const root = document.documentElement;
  const map: Record<ModuleAccent, string> = {
    dashboard: 'var(--accent-dashboard)',
    tasks: 'var(--accent-tasks)',
    journal: 'var(--accent-journal)',
    'fear-buster': 'var(--accent-fear)',
    focus: 'var(--accent-focus)',
  };
  const glowMap: Record<ModuleAccent, string> = {
    dashboard: 'hsl(160, 50%, 55% / 0.15)',
    tasks: 'hsl(160, 50%, 55% / 0.15)',
    journal: 'hsl(35, 70%, 60% / 0.15)',
    'fear-buster': 'hsl(250, 50%, 65% / 0.15)',
    focus: 'hsl(200, 60%, 55% / 0.15)',
  };
  const subtleMap: Record<ModuleAccent, string> = {
    dashboard: 'hsl(160, 50%, 55% / 0.08)',
    tasks: 'hsl(160, 50%, 55% / 0.08)',
    journal: 'hsl(35, 70%, 60% / 0.08)',
    'fear-buster': 'hsl(250, 50%, 65% / 0.08)',
    focus: 'hsl(200, 60%, 55% / 0.08)',
  };
  root.style.setProperty('--accent', map[accent]);
  root.style.setProperty('--accent-glow', glowMap[accent]);
  root.style.setProperty('--accent-subtle', subtleMap[accent]);
}

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  useEffect(() => {
    const accent = accentMap[location.pathname] || 'dashboard';
    setAccentVars(accent);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar onAccentChange={setAccentVars} />
      <main className="app-shell__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="app-shell__content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
