import { useEffect, useState, useRef, memo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/Layout/Sidebar';
import BackgroundAura from '@/components/Layout/BackgroundAura';
import type { ModuleAccent } from '@/types';
import './AppShell.css';

const MemoizedSidebar = memo(Sidebar);

const accentMap: Record<string, { accent: ModuleAccent; hue: number }> = {
  '/': { accent: 'dashboard', hue: 165 },
  '/tasks': { accent: 'tasks', hue: 165 },
  '/journal': { accent: 'journal', hue: 38 },
  '/fear-buster': { accent: 'fear-buster', hue: 265 },
  '/focus': { accent: 'focus', hue: 195 },
};

function setAccentVars(hue: number, currentHueRef: React.MutableRefObject<number>) {
  if (currentHueRef.current === hue) return;
  currentHueRef.current = hue;

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
  const currentHueRef = useRef(-1);

  const getRouteIndex = (path: string) => {
    const keys = Object.keys(accentMap);
    const index = keys.indexOf(path === '' ? '/' : path);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getRouteIndex(location.pathname);
  const [prevIndex, setPrevIndex] = useState(0);
  const direction = currentIndex >= prevIndex ? 1 : -1;

  useEffect(() => {
    setPrevIndex(currentIndex);
    const config = accentMap[location.pathname] || accentMap['/'];
    setAccentVars(config.hue, currentHueRef);
  }, [location.pathname, currentIndex]);

  return (
    <div className="app-shell">
      <BackgroundAura />
      <MemoizedSidebar onAccentChange={(accent) => {
        const item = Object.values(accentMap).find(v => v.accent === accent);
        if (item) setAccentVars(item.hue, currentHueRef);
      }} />
      <main className="app-shell__main">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: direction * -40, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="app-shell__content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
