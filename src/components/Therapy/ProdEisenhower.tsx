import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Shield, Zap, Calendar, Trash2, Plus, ArrowLeft, CheckCircle2, GripVertical } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

type Quadrant = 'do' | 'schedule' | 'delegate' | 'delete';

interface MatrixTask {
  id: string;
  text: string;
  quadrant: Quadrant;
}

const QUADRANTS: Record<Quadrant, { title: string; color: string; desc: string }> = {
  do: { title: 'Do First', color: 'var(--priority-urgent)', desc: 'Urgent & Important' },
  schedule: { title: 'Schedule', color: 'var(--accent)', desc: 'Important, Not Urgent' },
  delegate: { title: 'Delegate', color: 'var(--accent-journal)', desc: 'Urgent, Not Important' },
  delete: { title: 'Eliminate', color: 'var(--text-muted)', desc: 'Neither' }
};

export default function ProdEisenhower({ onComplete, onCancel }: Props) {
  const [tasks, setTasks] = useState<MatrixTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = (quad: Quadrant = 'do') => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Math.random().toString(), text: newTaskText, quadrant: quad }]);
    setNewTaskText('');
  };

  const moveTask = (id: string, newQuad: Quadrant) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, quadrant: newQuad } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>Eisenhower Matrix</h2>
        <p className="text-muted">Prioritize your tasks by urgency and importance.</p>
      </header>

      {/* Input Row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="New task to prioritize..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="btn btn-primary" onClick={() => addTask()} disabled={!newTaskText.trim()}>
          Add to "Do" <Plus size={18} />
        </button>
      </div>

      {/* The Matrix */}
      <LayoutGroup>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gridTemplateRows: '1fr 1fr', 
          gap: 'var(--space-4)',
          minHeight: '500px'
        }}>
          {(Object.keys(QUADRANTS) as Quadrant[]).map(q => (
            <div 
              key={q}
              className="glass-card"
              style={{ 
                padding: 'var(--space-4)', 
                display: 'flex', 
                flexDirection: 'column',
                borderTop: `4px solid ${QUADRANTS[q].color}`,
                background: 'rgba(255, 255, 255, 0.01)'
              }}
            >
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: QUADRANTS[q].color }}>{QUADRANTS[q].title}</h3>
                <p style={{ fontSize: 'var(--text-xxs)', color: 'var(--text-muted)' }}>{QUADRANTS[q].desc}</p>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <AnimatePresence>
                  {tasks.filter(t => t.quadrant === q).map(task => (
                    <motion.div
                      layout
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-card"
                      style={{ 
                        padding: 'var(--space-2) var(--space-3)', 
                        background: 'var(--bg-elevated)', 
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)' 
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-xs)', flex: 1 }}>{task.text}</span>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <select 
                          style={{ 
                            background: 'transparent', border: 'none', color: 'var(--text-muted)', 
                            fontSize: '10px', outline: 'none', cursor: 'pointer' 
                          }}
                          value={task.quadrant}
                          onChange={(e) => moveTask(task.id, e.target.value as Quadrant)}
                        >
                          <option value="do">Do</option>
                          <option value="schedule">Schedule</option>
                          <option value="delegate">Delegate</option>
                          <option value="delete">Eliminate</option>
                        </select>
                        <button 
                          onClick={() => removeTask(task.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>

      <footer style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          <ArrowLeft size={16} /> Cancel
        </button>
        <button 
          className="btn btn-primary" 
          disabled={tasks.length === 0}
          onClick={() => onComplete({ tasks })}
        >
          Finalize Priorities <CheckCircle2 size={18} />
        </button>
      </footer>
    </div>
  );
}
