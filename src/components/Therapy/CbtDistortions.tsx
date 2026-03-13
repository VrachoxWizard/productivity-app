import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Info, CheckCircle2, ArrowLeft, Lightbulb } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const DISTORTIONS = [
  { id: 'all_nothing', title: 'All-or-Nothing', desc: 'Thinking in extremes (black or white).' },
  { id: 'catastrophizing', title: 'Catastrophizing', desc: 'Expecting the worst possible outcome.' },
  { id: 'mind_reading', title: 'Mind Reading', desc: 'Assuming you know what others think.' },
  { id: 'filtering', title: 'Mental Filtering', desc: 'Focusing only on the negatives.' },
  { id: 'emotional_reasoning', title: 'Emotional Reasoning', desc: 'Assuming feelings are facts.' },
  { id: 'should_statements', title: 'Should Statements', desc: 'Using rigid rules for yourself/others.' },
];

export default function CbtDistortions({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    thought: '',
    selectedDistortions: [] as string[],
    balancedThought: ''
  });

  const toggleDistortion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDistortions: prev.selectedDistortions.includes(id) 
        ? prev.selectedDistortions.filter(d => d !== id)
        : [...prev.selectedDistortions, id]
    }));
  };

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <BrainCircuit className="text-accent" size={28} />
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>Distortion Identifier</h2>
        </div>
        <p className="text-muted">Break down the logic of your negative thoughts.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>1. What is the automatic thought?</h3>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: '100px', marginBottom: 'var(--space-6)' }}
              placeholder="e.g., I messed up that meeting, now everyone thinks I am incompetent."
              value={formData.thought}
              onChange={(e) => setFormData(prev => ({ ...prev, thought: e.target.value }))}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={!formData.thought}
              onClick={() => setStep(2)}
            >
              Analyze Logic
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>2. Identify the logical errors:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
              {DISTORTIONS.map(d => (
                <motion.div
                  key={d.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleDistortion(d.id)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: formData.selectedDistortions.includes(d.id) ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${formData.selectedDistortions.includes(d.id) ? 'var(--accent)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: formData.selectedDistortions.includes(d.id) ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {d.title}
                    </span>
                    {formData.selectedDistortions.includes(d.id) && <CheckCircle2 size={16} color="var(--accent)" />}
                  </div>
                  <p className="text-muted" style={{ fontSize: 'var(--text-xxs)', lineHeight: '1.4' }}>{d.desc}</p>
                </motion.div>
              ))}
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={formData.selectedDistortions.length === 0}
              onClick={() => setStep(3)}
            >
              Reframe Thought
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Lightbulb size={20} className="text-accent" />
              <h3 style={{ fontSize: 'var(--text-base)' }}>3. A more balanced perspective:</h3>
            </div>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
              Based on the distortions you found, what is a more realistic way to see this?
            </p>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: '100px', marginBottom: 'var(--space-6)' }}
              placeholder="e.g., I made a mistake, but I've had many successful meetings. People make mistakes and it doesn't mean I am incompetent."
              value={formData.balancedThought}
              onChange={(e) => setFormData(prev => ({ ...prev, balancedThought: e.target.value }))}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={!formData.balancedThought}
              onClick={() => onComplete(formData)}
            >
              Complete Analysis
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(step - 1) : onCancel()} style={{ fontSize: 'var(--text-xs)' }}>
          <ArrowLeft size={14} style={{ marginRight: 'var(--space-1)' }} />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
      </div>
    </div>
  );
}
