import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  BookOpen,
  Shield,
  Timer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { ModuleAccent } from '../../types';
import './Sidebar.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  accent: ModuleAccent;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, accent: 'dashboard' },
  { path: '/tasks', label: 'Tasks', icon: <ListTodo size={20} />, accent: 'tasks' },
  { path: '/journal', label: 'Journal', icon: <BookOpen size={20} />, accent: 'journal' },
  { path: '/fear-buster', label: 'Fear Buster', icon: <Shield size={20} />, accent: 'fear-buster' },
  { path: '/focus', label: 'Focus Mode', icon: <Timer size={20} />, accent: 'focus' },
];

function MagneticIcon({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  );
}

interface SidebarProps {
  onAccentChange: (accent: ModuleAccent) => void;
}

export default function Sidebar({ onAccentChange }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="sidebar__brand"
          >
            <div className="sidebar__logo" />
            <span className="sidebar__title">MindSpace</span>
          </motion.div>
        )}
        <button
          className="btn btn-icon btn-ghost sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <ul className="sidebar__nav">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                data-accent={item.accent}
                onClick={() => onAccentChange(item.accent)}
                title={collapsed ? item.label : undefined}
              >
                <MagneticIcon>
                  <span className="sidebar__icon">{item.icon}</span>
                </MagneticIcon>
                {!collapsed && (
                  <motion.span 
                    layout
                    className="sidebar__label"
                  >
                    {item.label}
                  </motion.span>
                )}
                {active && (
                  <motion.span 
                    layoutId="sidebar-active"
                    className="sidebar__indicator" 
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {!collapsed && (
        <div className="sidebar__footer">
          <p className="sidebar__quote">One step at a time.</p>
        </div>
      )}
    </nav>
  );
}
