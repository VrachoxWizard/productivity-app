import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Shield, ArrowUp, ArrowDown, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ExposureStep {
  id: string;
  title: string;
  difficulty: number; // 0-100
  completed: boolean;
}

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function ExposureLadder({ onComplete, onCancel }: Props) {
  const [fear, setFear] = useState('');
  const [steps, setSteps] = useState<ExposureStep[]>([]);
  const [newStep, setNewStep] = useState('');
  const [newDiff, setNewDiff] = useState(50);
  const [isBuilding, setIsBuilding] = useState(true);

  const addStep = () => {
    if (!newStep.trim()) return;
    const step: ExposureStep = {
      id: Math.random().toString(36).substr(2, 9),
      title: newStep,
      difficulty: newDiff,
      completed: false
    };
    setSteps(prev => [...prev, step].sort((a, b) => a.difficulty - b.difficulty));
    setNewStep('');
  };

  const removeStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const toggleComplete = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  return (
    <div className="exposure-ladder glass-card" style={{ padding: 'var(--space-8)', maxWidth: '700px', margin: '0 auto' }}>
      <div className="exposure-ladder__header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2>Exposure Ladder</h2>
        <p style={{ color: 'var(--text-muted)' }}>Break down a big fear into small, surmountable steps.</p>
      </div>

      {isBuilding ? (
        <div className="exposure-ladder__builder">
          <label className="label">What is the central fear?</label>
          <input 
            className="input" 
            placeholder="e.g., Public speaking, Crowded places..." 
            value={fear}
            onChange={(e) => setFear(e.target.value)}
            style={{ marginBottom: 'var(--space-6)' }}
          />

          <div className="glass-card" style={{ padding: 'var(--space-5)', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>Add steps (from least to most scary)</h4>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <input 
                className="input" 
                placeholder="What is a small step?" 
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
              />
              <div style={{ minWidth: '100px', textAlign: 'center' }}>
                <span style={{ fontSize: 'var(--text-xxs)', color: 'var(--text-muted)' }}>Difficulty: {newDiff}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={newDiff} 
                  onChange={(e) => setNewDiff(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <button className="btn btn-primary" onClick={addStep}><Plus size={18} /></button>
            </div>

            <div className="exposure-ladder__preview-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {steps.map((s, i) => (
                <div key={s.id} className="glass-card" style={{ padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--text-xxs)', color: 'var(--accent)', fontWeight: '700' }}>#{i+1}</span>
                    <span>{s.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>SUDs: {s.difficulty}</span>
                    <button className="btn-ghost" onClick={() => removeStep(s.id)} style={{ padding: '2px', border: 'none', background: 'none', color: 'var(--priority-urgent)' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'var(--space-8)' }}
            disabled={!fear || steps.length < 2}
            onClick={() => setIsBuilding(false)}
          >
            Start My Exposure Plan
          </button>
        </div>
      ) : (
        <div className="exposure-ladder__display">
          <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            <span style={{ fontSize: 'var(--text-xxs)', textTransform: 'uppercase', color: 'var(--accent)' }}>Currently Facing</span>
            <h3 style={{ fontSize: 'var(--text-xl)' }}>{fear}</h3>
          </div>

          <div className="ladder" style={{ display: 'flex', flexDirection: 'column-reverse', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {steps.map((s, i) => (
              <motion.div 
                key={s.id}
                className={`ladder-step ${s.completed ? 'ladder-step--done' : ''}`}
                style={{ 
                  padding: 'var(--space-5)', 
                  background: s.completed ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-card)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: (i > 0 && !steps[i-1].completed && !s.completed) ? 0.5 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <button 
                    className={`btn-icon ${s.completed ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleComplete(s.id)}
                    style={{ borderRadius: 'var(--radius-full)', width: '32px', height: '32px' }}
                  >
                    {s.completed ? <CheckCircle2 size={16} /> : <Shield size={16} />}
                  </button>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{s.title}</div>
                    <div style={{ fontSize: 'var(--text-xxs)', color: 'var(--text-muted)' }}>Anxiety Target: {s.difficulty}</div>
                  </div>
                </div>
                {i === steps.findIndex(st => !st.completed) && (
                   <span className="badge" style={{ background: 'var(--accent)', color: 'var(--text-inverse)' }}>Current Goal</span>
                )}
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsBuilding(true)}>Edit Ladder</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onComplete({ fear, steps })}>Save Progress</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-10)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
        <button onClick={onCancel} className="btn-ghost" style={{ fontSize: 'var(--text-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          Exit Exercise
        </button>
      </div>
    </div>
  );
}
