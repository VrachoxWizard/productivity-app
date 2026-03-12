import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Star, Users, Briefcase, Zap, Globe, Sparkles, Check } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const DEFAULT_VALUES = [
  { id: 'freedom', label: 'Freedom', icon: <Globe size={16} /> },
  { id: 'compassion', label: 'Compassion', icon: <Heart size={16} /> },
  { id: 'growth', label: 'Personal Growth', icon: <Zap size={16} /> },
  { id: 'health', label: 'Physical Health', icon: <Shield size={16} /> },
  { id: 'adventure', label: 'Adventure', icon: <Globe size={16} /> },
  { id: 'connection', label: 'Connection', icon: <Users size={16} /> },
  { id: 'career', label: 'Career Success', icon: <Briefcase size={16} /> },
  { id: 'creativity', label: 'Creativity', icon: <Sparkles size={16} /> },
  { id: 'honesty', label: 'Honesty', icon: <Star size={16} /> },
  { id: 'spirituality', label: 'Spirituality', icon: <Star size={16} /> },
  { id: 'stability', label: 'Stability', icon: <Shield size={16} /> },
  { id: 'knowledge', label: 'Knowledge', icon: <Briefcase size={16} /> },
];

type Priority = 'top' | 'medium' | 'low' | 'unassigned';

export default function ActValues({ onComplete, onCancel }: Props) {
  const [selections, setSelections] = useState<Record<string, Priority>>(
    DEFAULT_VALUES.reduce((acc, v) => ({ ...acc, [v.id]: 'unassigned' }), {})
  );

  const setPriority = (id: string, priority: Priority) => {
    setSelections(prev => ({ ...prev, [id]: priority }));
  };

  const getByPriority = (priority: Priority) => 
    DEFAULT_VALUES.filter(v => selections[v.id] === priority);

  const isComplete = DEFAULT_VALUES.every(v => selections[v.id] !== 'unassigned');

  return (
    <div className="act-values glass-card" style={{ padding: 'var(--space-8)', maxWidth: '900px', margin: '0 auto' }}>
      <div className="act-values__header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2>Value Card Sort</h2>
        <p style={{ color: 'var(--text-muted)' }}>Sort these core values based on what truly matters to you right now.</p>
      </div>

      <div className="act-values__grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: 'var(--space-8)' }}>
        {/* Unassigned Pool */}
        <div className="act-values__pool">
          <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', textTransform: 'uppercase' }}>
            To Sort ({getByPriority('unassigned').length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <AnimatePresence>
              {getByPriority('unassigned').map(val => (
                <motion.button
                  key={val.id}
                  layoutId={val.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="btn btn-ghost"
                  style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)' }}
                  onClick={() => setPriority(val.id, 'medium')}
                >
                  {val.icon} {val.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Priority Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {(['top', 'medium', 'low'] as const).map(p => (
            <div 
              key={p} 
              className="glass-card" 
              style={{ 
                padding: 'var(--space-4)', 
                minHeight: '100px',
                background: p === 'top' ? 'rgba(var(--accent-rgb), 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: p === 'top' ? '1px solid var(--accent)' : '1px solid var(--border)'
              }}
            >
              <h4 style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)', color: p === 'top' ? 'var(--accent)' : 'var(--text-muted)' }}>
                {p === 'top' ? '🌟 Core Values' : p === 'medium' ? 'Important' : 'Secondary'}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {getByPriority(p).map(val => (
                  <motion.button
                    key={val.id}
                    layoutId={val.id}
                    className="btn btn-sm"
                    style={{ 
                      background: p === 'top' ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: p === 'top' ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: 'none'
                    }}
                    onClick={() => {
                      const next: Record<Priority, Priority> = { top: 'medium', medium: 'low', low: 'unassigned', unassigned: 'top' };
                      setPriority(val.id, next[p]);
                    }}
                  >
                    {val.label}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button 
          className="btn btn-primary" 
          disabled={!isComplete} 
          onClick={() => onComplete({ values: selections })}
        >
          <Check size={18} /> Confirm My Values
        </button>
      </div>
    </div>
  );
}
