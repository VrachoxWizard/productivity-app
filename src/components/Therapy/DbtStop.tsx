import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Octagon, Wind, Eye, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function DbtStop({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [breathTimer, setBreathTimer] = useState(10);
  const [isBreathing, setIsBreathing] = useState(false);
  const [formData, setFormData] = useState({
    observation: '',
    mindfulAction: ''
  });

  useEffect(() => {
    let interval: any;
    if (isBreathing && breathTimer > 0) {
      interval = setInterval(() => setBreathTimer(t => t - 1), 1000);
    } else if (breathTimer === 0) {
      setIsBreathing(false);
      // Auto-advance after 1s to let them see "0"
      setTimeout(() => setStep(3), 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathTimer]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>S.T.O.P Skill</h2>
        <p className="text-muted">A crisis skill to stop impulsive action.</p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              background: s <= step ? 'var(--accent)' : 'var(--bg-elevated)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="stop"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ color: '#ff4b4b', display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}
            >
              <Octagon size={80} fill="rgba(255, 75, 75, 0.1)" strokeWidth={1.5} />
            </motion.div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Stop!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
              Freeze. Do not move a muscle. Your emotions may be trying to make you act without thinking. 
              Stay in control.
            </p>
            <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%' }}>
              I am still <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="take-breath"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto var(--space-8)' }}>
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'rgba(var(--accent-rgb), 0.1)', 
                  borderRadius: '50%', border: '2px solid var(--accent)' 
                }}
              />
              <div style={{ 
                position: 'absolute', inset: 0, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)',
                fontWeight: '700', color: 'var(--accent)'
              }}>
                {isBreathing ? breathTimer : <Wind size={40} />}
              </div>
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Take a Breath</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
              Inhale deeply for 4 seconds, hold, then exhale for 6. Repeat until the timer ends.
            </p>
            {!isBreathing ? (
              <button className="btn btn-primary" onClick={() => setIsBreathing(true)} style={{ width: '100%' }}>
                Start Breathing
              </button>
            ) : (
              <button className="btn" disabled={breathTimer > 0} onClick={handleNext} style={{ width: '100%' }}>
                {breathTimer > 0 ? 'Observe the rhythm...' : 'Continue'}
              </button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="observe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div className="icon-box" style={{ color: 'var(--accent-journal)' }}><Eye size={24} /></div>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>Observe</h3>
            </div>
            <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
              What is going on inside and outside you? What are you feeling in your body right now?
            </p>
            <textarea 
              className="input" 
              placeholder="I feel tension in my shoulders, my heart is racing..."
              style={{ width: '100%', minHeight: '120px', marginBottom: 'var(--space-8)' }}
              value={formData.observation}
              onChange={(e) => setFormData(prev => ({ ...prev, observation: e.target.value }))}
            />
            <button className="btn btn-primary" disabled={!formData.observation} onClick={handleNext} style={{ width: '100%' }}>
              Proceed <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="proceed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div className="icon-box" style={{ color: 'var(--accent)' }}><CheckCircle2 size={24} /></div>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>Proceed Mindfully</h3>
            </div>
            <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
              What is the most effective thing to do right now? What will move you toward your goals?
            </p>
            <textarea 
              className="input" 
              placeholder="I will go for a 5-minute walk instead of senting that email..."
              style={{ width: '100%', minHeight: '120px', marginBottom: 'var(--space-8)' }}
              value={formData.mindfulAction}
              onChange={(e) => setFormData(prev => ({ ...prev, mindfulAction: e.target.value }))}
            />
            <button className="btn btn-primary" disabled={!formData.mindfulAction} onClick={handleNext} style={{ width: '100%' }}>
              Complete Exercise
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={handleBack} style={{ fontSize: 'var(--text-xs)' }}>
          <ArrowLeft size={14} style={{ marginRight: 'var(--space-1)' }} /> 
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
      </div>
    </div>
  );
}
