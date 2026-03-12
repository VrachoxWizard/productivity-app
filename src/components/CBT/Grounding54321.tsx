import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Eye, Hand, Volume2, Fingerprint, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const steps = [
  { id: 5, label: 'things you see', icon: <Eye size={24} />, color: 'var(--accent)' },
  { id: 4, label: 'things you can touch', icon: <Hand size={24} />, color: 'var(--accent-journal)' },
  { id: 3, label: 'things you hear', icon: <Volume2 size={24} />, color: 'var(--accent-fear)' },
  { id: 2, label: 'things you can smell', icon: <Wind size={24} />, color: 'var(--accent-focus)' },
  { id: 1, label: 'thing you can taste', icon: <Fingerprint size={24} />, color: 'var(--accent-tasks)' },
];

export default function Grounding54321({ onComplete, onCancel }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<string[][]>(Array(5).fill([]));
  const [inputValue, setInputValue] = useState('');

  const step = steps[currentStep];
  const currentItems = items[currentStep];

  const addItem = () => {
    if (!inputValue.trim() || currentItems.length >= step.id) return;
    const newItems = [...items];
    newItems[currentStep] = [...currentItems, inputValue.trim()];
    setItems(newItems);
    setInputValue('');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInputValue('');
    } else {
      onComplete({ type: 'grounding_54321', items, completedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="cbt-exercise grounding">
      <div className="cbt-exercise__header">
        <div className="step-indicator">
          {steps.map((s, i) => (
            <div 
              key={s.id} 
              className={`step-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
              style={{ '--step-color': s.color } as any}
            />
          ))}
        </div>
        <h2>5-4-3-2-1 Grounding</h2>
        <p>Focus on your surroundings to calm your nervous system.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grounding__step"
        >
          <div className="grounding__prompt" style={{ color: step.color }}>
            <span className="grounding__number">{step.id}</span>
            <span className="grounding__label">{step.label}</span>
          </div>

          <div className="grounding__input-group">
            <input
              type="text"
              className="input"
              placeholder="Notice something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              disabled={currentItems.length >= step.id}
              autoFocus
            />
            <button 
              className="btn btn-primary" 
              onClick={addItem}
              disabled={!inputValue.trim() || currentItems.length >= step.id}
            >
              Add
            </button>
          </div>

          <div className="grounding__items">
            {currentItems.map((item, i) => (
              <motion.div 
                key={i} 
                className="grounding-item glass-card"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {item}
              </motion.div>
            ))}
            {Array.from({ length: step.id - currentItems.length }).map((_, i) => (
              <div key={`empty-${i}`} className="grounding-item grounding-item--empty" />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="cbt-exercise__footer">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={currentItems.length < step.id}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}
