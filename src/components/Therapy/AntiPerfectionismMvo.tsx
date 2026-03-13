import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Clock, ArrowLeft, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function AntiPerfectionismMvo({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dauntingTask: '',
    mvoDefinition: '',
    timeLimit: 30,
    perfectionistFear: ''
  });

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <Sparkles className="text-accent" size={28} />
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>MVO Builder</h2>
        </div>
        <p className="text-muted">Minimum Viable Outcome: Done is better than perfect.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>1. What task are you obsessing over?</h3>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: '80px', marginBottom: 'var(--space-6)' }}
              placeholder="e.g., Designing the perfect portfolio website."
              value={formData.dauntingTask}
              onChange={(e) => setFormData(prev => ({ ...prev, dauntingTask: e.target.value }))}
            />
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>What is the "Perfectionist Trap" here?</h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>What detail are you worried won't be perfect?</p>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: '80px', marginBottom: 'var(--space-6)' }}
              placeholder="e.g., The exact shade of blue and the font kerning."
              value={formData.perfectionistFear}
              onChange={(e) => setFormData(prev => ({ ...prev, perfectionistFear: e.target.value }))}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={!formData.dauntingTask || !formData.perfectionistFear}
              onClick={() => setStep(2)}
            >
              Define the MVO
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Target size={20} className="text-accent" />
              <h3 style={{ fontSize: 'var(--text-base)' }}>2. What is 80% good enough?</h3>
            </div>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-6)' }}>
              If you only had 1 hour to finish this, what would the result look like? That is your MVO.
            </p>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: '100px', marginBottom: 'var(--space-8)' }}
              placeholder="e.g., A single page with my name, 3 projects, and an email link. Simple fonts."
              value={formData.mvoDefinition}
              onChange={(e) => setFormData(prev => ({ ...prev, mvoDefinition: e.target.value }))}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Clock size={20} style={{ color: 'var(--accent-journal)' }} />
              <h3 style={{ fontSize: 'var(--text-base)' }}>Strict Time Cap (Mins):</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
              <input 
                type="range" min="5" max="120" step="5"
                style={{ flex: 1, accentColor: 'var(--accent)' }}
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
              />
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: '700', minWidth: '60px' }}>{formData.timeLimit}m</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={!formData.mvoDefinition}
              onClick={() => setStep(3)}
            >
              Verify Reality
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
               <AlertTriangle size={48} className="text-accent" style={{ marginBottom: 'var(--space-4)' }} />
               <h3 style={{ fontSize: 'var(--text-lg)' }}>Accept the Imperfection</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                 You are trading "Perfect" (which doesn't exist) for "Finished" (which is powerful).
               </p>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-6)', background: 'rgba(var(--accent-rgb), 0.05)', marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xxs)', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)' }}>Target Outcome</span>
                <span style={{ fontSize: 'var(--text-xxs)', color: 'var(--text-muted)' }}>Cap: {formData.timeLimit}m</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{formData.mvoDefinition}</p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => onComplete(formData)}
            >
              I Commit to Finished <CheckCircle2 size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(step - 1) : onCancel()} style={{ fontSize: 'var(--text-xs)' }}>
          <ArrowLeft size={14} /> {step === 1 ? 'Cancel' : 'Back'}
        </button>
      </div>
    </div>
  );
}
