import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, ArrowLeft, Target, Rocket, Plus, Trash2 } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const PRESETS = [
  "Drink a glass of water",
  "Text one friend",
  "Stand up and stretch",
  "Step outside for 2 mins",
  "Wash one dish",
  "Deep breath (30s)"
];

export default function CbtBehavioralActivation({ onComplete, onCancel }: Props) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState('');
  const [isDone, setIsDone] = useState(false);

  const toggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
      setCompletedTasks(completedTasks.filter(t => t !== task));
    } else {
      if (selectedTasks.length < 3) setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleToggleComplete = (task: string) => {
    if (completedTasks.includes(task)) {
      setCompletedTasks(completedTasks.filter(t => t !== task));
    } else {
      const updated = [...completedTasks, task];
      setCompletedTasks(updated);
      if (updated.length === 3) {
        setIsDone(true);
        setTimeout(() => onComplete({ tasks: selectedTasks }), 2500);
      }
    }
  };

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <Rocket className="text-accent" size={28} />
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>Behavioral Activation</h2>
        </div>
        <p className="text-muted">Break the cycle of low energy with 3 micro-wins.</p>
      </header>

      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {selectedTasks.length < 3 ? (
              <section>
                <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>Pick 3 tiny, achievable tasks:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  {PRESETS.map(p => (
                    <button
                      key={p}
                      className={`btn btn-sm ${selectedTasks.includes(p) ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => toggleTask(p)}
                      style={{ fontSize: 'var(--text-xs)', height: '44px' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input 
                    className="input" 
                    placeholder="Or type a custom micro-task..."
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && customTask && (toggleTask(customTask), setCustomTask(''))}
                  />
                  <button className="btn btn-secondary" onClick={() => (toggleTask(customTask), setCustomTask(''))} disabled={!customTask}>
                    <Plus size={18} />
                  </button>
                </div>
              </section>
            ) : (
              <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                   <h3 style={{ fontSize: 'var(--text-base)' }}>Your Tiny Missions:</h3>
                   <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>{completedTasks.length}/3</span>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                   {selectedTasks.map(t => (
                     <motion.div
                       key={t}
                       whileTap={{ scale: 0.98 }}
                       className="glass-card"
                       onClick={() => handleToggleComplete(t)}
                       style={{ 
                         padding: 'var(--space-4)', cursor: 'pointer',
                         display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                         background: completedTasks.includes(t) ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--bg-elevated)',
                         border: `1px solid ${completedTasks.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
                         opacity: completedTasks.includes(t) ? 0.7 : 1
                       }}
                     >
                       <div style={{ 
                         width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--accent)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: completedTasks.includes(t) ? 'var(--accent)' : 'transparent'
                       }}>
                         {completedTasks.includes(t) && <CheckCircle2 size={16} color="white" />}
                       </div>
                       <span style={{ 
                         textDecoration: completedTasks.includes(t) ? 'line-through' : 'none',
                         fontWeight: '600'
                       }}>{t}</span>
                     </motion.div>
                   ))}
                 </div>
                 <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTasks([])} style={{ width: '100%' }}>
                   <Trash2 size={14} /> Reset List
                 </button>
              </motion.section>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, ease: "backOut" }}
              style={{ color: 'var(--accent)', marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}
            >
              <Zap size={80} fill="rgba(var(--accent-rgb), 0.2)" />
            </motion.div>
            <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Cycle Broken!</h2>
            <p className="text-muted">You're moving again. Keep that momentum.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDone && (
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel} style={{ fontSize: 'var(--text-xs)' }}>
            <ArrowLeft size={14} /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}
