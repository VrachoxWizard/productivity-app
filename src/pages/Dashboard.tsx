import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ListTodo,
  BookOpen,
  Shield,
  Timer,
  CheckCircle2,
  TrendingUp,
  Flame,
  Sun,
  Moon,
  CloudSun,
  Sunrise,
  Activity,
  Zap,
  Wind,
  Plus,
  Droplet
} from 'lucide-react';
import { loadData, saveData, generateId } from '../lib/storage';
import type { Task, JournalEntry, TherapyLog, FocusSession, MoodLevel } from '../types';
import StatsGraph from '../components/StatsGraph';
import EmotionWheel from '../components/EmotionWheel';
import './Dashboard.css';

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Still up? Be gentle.', icon: <Moon size={24} /> };
  if (hour < 12) return { text: 'Good morning, MindSpace.', icon: <Sunrise size={24} /> };
  if (hour < 17) return { text: 'How is your afternoon?', icon: <Sun size={24} /> };
  if (hour < 21) return { text: 'Good evening.', icon: <CloudSun size={24} /> };
  return { text: 'Ready to rest?', icon: <Moon size={24} /> };
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const greeting = getGreeting();
  const [stats, setStats] = useState({
    tasksToday: 0,
    tasksCompleted: 0,
    journalStreak: 0,
    cbtExercises: 0,
    focusSessions: 0,
  });
  
  const [moodHistory, setMoodHistory] = useState<number[]>([]);
  const [focusHistory, setFocusHistory] = useState<number[]>([]);

  useEffect(() => {
    const tasks = loadData<Task[]>('tasks', []);
    const journals = loadData<JournalEntry[]>('journal_entries', []);
    const therapyLogs = loadData<TherapyLog[]>('therapy_logs', []);
    const sessions = loadData<FocusSession[]>('focus_sessions', []);

    const today = new Date().toISOString().slice(0, 10);
    const tasksToday = tasks.filter(t => t.createdAt.startsWith(today));

    // Calculate journal streak
    let streak = 0;
    const sortedJournals = [...journals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const checkDate = new Date();
    for (const entry of sortedJournals) {
      const entryDate = entry.createdAt.slice(0, 10);
      const checkStr = checkDate.toISOString().slice(0, 10);
      if (entryDate === checkStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Mood History (last 7 entries)
    const moods = sortedJournals.slice(0, 7).reverse().map(j => j.mood);
    setMoodHistory(moods);

    // Focus History (sessions per day for last 7 days)
    const focusDays = Array(7).fill(0);
    sessions.forEach(s => {
      const daysAgo = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7) focusDays[6 - daysAgo]++;
    });
    setFocusHistory(focusDays.map(v => Math.min(v + 1, 5))); // Normalize 1-5 for graph

    setStats({
      tasksToday: tasksToday.length,
      tasksCompleted: tasksToday.filter(t => t.completed).length,
      journalStreak: streak,
      cbtExercises: therapyLogs.length,
      focusSessions: sessions.filter(s => s.completed).length,
    });
  }, []);

  const focusLevel = useMemo(() => {
    const count = stats.focusSessions;
    if (count === 0) return { label: 'Seed', color: 'var(--text-muted)' };
    if (count < 5) return { label: 'Sprout', color: 'var(--mood-4)' };
    if (count < 15) return { label: 'Bloom', color: 'var(--accent)' };
    return { label: 'Forest', color: 'var(--accent-tasks)' };
  }, [stats.focusSessions]);

  return (
    <motion.div
      className="dashboard"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <header className="dashboard__header">
        <motion.div className="dashboard__greeting" variants={fadeUp}>
          <span className="dashboard__greeting-icon">{greeting.icon}</span>
          <h1>{greeting.text}</h1>
        </motion.div>
        
        <motion.div className="dashboard__focus-meter glass-card" variants={fadeUp}>
          <div className="meter-info">
            <span className="meter-label">Focus Level</span>
            <span className="meter-value" style={{ color: focusLevel.color }}>{focusLevel.label}</span>
          </div>
          <div className="meter-bar">
            <div 
              className="meter-fill" 
              style={{ 
                width: `${Math.min((stats.focusSessions / 20) * 100, 100)}%`,
                background: focusLevel.color 
              }} 
            />
          </div>
        </motion.div>
      </header>

      <div className="dashboard__grid">
        {/* Main Stats Row */}
        <motion.div className="dashboard__stats-overview" variants={fadeUp}>
          <div className="stat-card glass-card">
            <div className="stat-card__icon" style={{ color: 'var(--accent-tasks)' }}>
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stats.tasksCompleted}/{stats.tasksToday}</span>
              <span className="stat-card__label">Tasks Done</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card__icon" style={{ color: 'var(--accent-journal)' }}>
              <Flame size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stats.journalStreak}</span>
              <span className="stat-card__label">Day Streak</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card__graph-container">
              <div className="stat-card__graph-header">
                <Activity size={14} />
                <span>Mood Trend</span>
              </div>
              <StatsGraph data={moodHistory} color="var(--accent-fear)" height={30} />
            </div>
          </div>
        </motion.div>

        {/* Emotion Wheel integration */}
        <motion.div className="dashboard__emotion-logger glass-card" variants={fadeUp}>
           <div className="card-header">
            <h3>Nuanced Mood</h3>
            <p className="text-muted">Map your current state</p>
          </div>
          <EmotionWheel onSelect={(e) => console.log('Emotion picked:', e)} />
        </motion.div>

        {/* Weekly Insights */}
        <motion.div className="dashboard__insights glass-card" variants={fadeUp}>
          <div className="card-header">
            <TrendingUp size={18} className="text-accent" />
            <h3>Weekly Insight</h3>
          </div>
          <div className="insight-content">
            <p>"Your energy levels tend to dip consistently around 3 PM. Consider scheduling your DBT Breathwork then to maintain flow."</p>
            <div className="insight-tags">
              <span className="insight-tag">Behavioral Trend</span>
              <span className="insight-tag">Pro Tip</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Relief */}
        <motion.div className="dashboard__quick-relief" variants={fadeUp}>
          <h3 className="section-title">Quick Relief</h3>
          <div className="relief-grid">
            <Link to="/fear-buster" className="relief-card glass-card">
              <Wind size={24} />
              <span>Grounding</span>
            </Link>
            <Link to="/fear-buster" className="relief-card glass-card">
              <Droplet size={24} />
              <span>DBT TIPP</span>
            </Link>
            <Link to="/focus" className="relief-card glass-card">
              <Zap size={24} />
              <span>Breathe</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
