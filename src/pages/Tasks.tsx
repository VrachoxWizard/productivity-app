import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Zap, Star, Clock } from 'lucide-react';
import { loadData, saveData, generateId } from '../lib/storage';
import type { Task } from '../types';
import './Tasks.css';

type FilterMode = 'active' | 'completed' | 'all';

const priorityConfig = {
  urgent: { label: 'Urgent', icon: <Zap size={12} />, color: 'var(--priority-urgent)' },
  important: { label: 'Important', icon: <Star size={12} />, color: 'var(--priority-important)' },
  'can-wait': { label: 'Can Wait', icon: <Clock size={12} />, color: 'var(--priority-can-wait)' },
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<FilterMode>('active');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('important');

  useEffect(() => {
    setTasks(loadData<Task[]>('tasks', []));
  }, []);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveData('tasks', updated);
  }, []);

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    const task: Task = {
      id: generateId(),
      title,
      description: '',
      priority: selectedPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist([task, ...tasks]);
    setNewTitle('');
  };

  const toggleTask = (id: string) => {
    persist(
      tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    persist(tasks.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <h1>Tasks</h1>
        <p>Brain dump everything. Prioritize later.</p>
      </div>

      <div className="tasks-page__add glass-card">
        <div className="tasks-page__priority-bar">
          {(Object.keys(priorityConfig) as Task['priority'][]).map((p) => (
            <button
              key={p}
              className={`priority-btn ${selectedPriority === p ? 'priority-btn--active' : ''}`}
              style={{ '--p-color': priorityConfig[p].color } as React.CSSProperties}
              onClick={() => setSelectedPriority(p)}
            >
              {priorityConfig[p].icon}
              {priorityConfig[p].label}
            </button>
          ))}
        </div>
        <div className="tasks-page__input-row">
          <input
            className="input"
            placeholder="What's on your mind?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-primary" onClick={addTask} disabled={!newTitle.trim()}>
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="tasks-page__filters">
        {(['active', 'completed', 'all'] as FilterMode[]).map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'active' && ` (${tasks.filter(t => !t.completed).length})`}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="tasks-page__list"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
              transition={{ 
                duration: 0.4, 
                ease: [0.34, 1.56, 0.64, 1],
                delay: index * 0.05 
              }}
              className={`task-card glass-card ${task.completed ? 'task-card--done' : ''}`}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`task-card__check ${task.completed ? 'task-card__check--checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                style={{ '--p-color': priorityConfig[task.priority].color } as React.CSSProperties}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>

              <div className="task-card__content">
                <span className={`task-card__title ${task.completed ? 'task-card__title--done' : ''}`}>
                  {task.title}
                </span>
                <motion.span
                  layoutId={`priority-${task.id}`}
                  className="badge"
                  style={{
                    background: `color-mix(in srgb, ${priorityConfig[task.priority].color} 15%, transparent)`,
                    color: priorityConfig[task.priority].color,
                    border: `1px solid color-mix(in srgb, ${priorityConfig[task.priority].color} 30%, transparent)`,
                  }}
                >
                  {priorityConfig[task.priority].icon}
                  {priorityConfig[task.priority].label}
                </motion.span>
              </div>

              <button
                className="btn btn-icon btn-ghost task-card__delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tasks-page__empty"
          >
            <div className="empty-illustration">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.2" />
                <path d="M40 60L55 75L80 45" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                <rect x="30" y="30" width="60" height="60" rx="12" stroke="currentColor" strokeWidth="1" opacity="0.1" />
              </svg>
            </div>
            <p>{filter === 'completed' ? 'No completed tasks yet.' : 'The slate is clean. What will you conquer today?'}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
