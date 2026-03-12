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
          <div className="sidebar__brand">
            <div className="sidebar__logo" />
            <span className="sidebar__title">MindSpace</span>
          </div>
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
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar__link ${isActive(item.path) ? 'sidebar__link--active' : ''}`}
              data-accent={item.accent}
              onClick={() => onAccentChange(item.accent)}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {!collapsed && <span className="sidebar__label">{item.label}</span>}
              {isActive(item.path) && <span className="sidebar__indicator" />}
            </Link>
          </li>
        ))}
      </ul>

      {!collapsed && (
        <div className="sidebar__footer">
          <p className="sidebar__quote">One step at a time.</p>
        </div>
      )}
    </nav>
  );
}
