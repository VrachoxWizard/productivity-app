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

      <div className="tasks-page__list">
        <AnimatePresence mode="popLayout">
          {filtered.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`task-card glass-card ${task.completed ? 'task-card--done' : ''}`}
            >
              <button
                className={`task-card__check ${task.completed ? 'task-card__check--checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                style={{ '--p-color': priorityConfig[task.priority].color } as React.CSSProperties}
              >
                {task.completed && <Check size={14} />}
              </button>

              <div className="task-card__content">
                <span className={`task-card__title ${task.completed ? 'task-card__title--done' : ''}`}>
                  {task.title}
                </span>
                <span
                  className="badge"
                  style={{
                    background: `color-mix(in srgb, ${priorityConfig[task.priority].color} 15%, transparent)`,
                    color: priorityConfig[task.priority].color,
                  }}
                >
                  {priorityConfig[task.priority].icon}
                  {priorityConfig[task.priority].label}
                </span>
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
          <div className="tasks-page__empty">
            <p>{filter === 'completed' ? 'No completed tasks yet.' : 'All clear! Add something above.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
