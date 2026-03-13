import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import BackgroundAura from './BackgroundAura';
import type { ModuleAccent } from '../../types';
import './AppShell.css';

const accentMap: Record<string, { accent: ModuleAccent; hue: number }> = {
  '/': { accent: 'dashboard', hue: 165 },
  '/tasks': { accent: 'tasks', hue: 165 },
  '/journal': { accent: 'journal', hue: 38 },
  '/fear-buster': { accent: 'fear-buster', hue: 265 },
  '/focus': { accent: 'focus', hue: 195 },
};

function setAccentVars(hue: number) {
  const root = document.documentElement;
  root.style.setProperty('--accent-h', hue.toString());
  
  const map: Record<number, string> = {
    165: 'var(--accent-dashboard)',
    38: 'var(--accent-journal)',
    265: 'var(--accent-fear)',
    195: 'var(--accent-focus)',
  };
  root.style.setProperty('--accent', map[hue] || map[165]);
}

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  const getRouteIndex = (path: string) => {
    const keys = Object.keys(accentMap);
    const index = keys.indexOf(path === '' ? '/' : path);
    return index === -1 ? 0 : index;
  };

  const [prevIndex, setPrevIndex] = useState(0);
  const currentIndex = getRouteIndex(location.pathname);
  const direction = currentIndex >= prevIndex ? 1 : -1;

  useEffect(() => {
    setPrevIndex(currentIndex);
    const config = accentMap[location.pathname] || accentMap['/'];
    setAccentVars(config.hue);
  }, [location.pathname, currentIndex]);

  return (
    <div className="app-shell">
      <BackgroundAura />
      <Sidebar onAccentChange={(accent) => {
        const item = Object.values(accentMap).find(v => v.accent === accent);
        if (item) setAccentVars(item.hue);
      }} />
      <main className="app-shell__main">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction * -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="app-shell__content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
