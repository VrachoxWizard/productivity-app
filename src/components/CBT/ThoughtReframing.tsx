import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import type { MoodLevel } from '../../types';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const moodLabels: Record<MoodLevel, string> = { 1: 'Very anxious', 2: 'Anxious', 3: 'Uneasy', 4: 'Mostly calm', 5: 'Calm' };

const steps = [
  { title: 'Identify', description: 'What is the fear or anxious thought?' },
  { title: 'Evidence For', description: 'What evidence supports this fear being real?' },
  { title: 'Evidence Against', description: 'What evidence suggests this fear may not be realistic?' },
  { title: 'Reframe', description: 'Write a more balanced, realistic thought.' },
  { title: 'Action', description: 'What\'s one small step you can take right now?' },
];

export default function ThoughtReframing({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ fear: '', evidenceFor: '', evidenceAgainst: '', balancedThought: '', nextStep: '' });
  const [moodBefore, setMoodBefore] = useState<MoodLevel>(2);
  const [moodAfter, setMoodAfter] = useState<MoodLevel>(3);

  const currentField = (): keyof typeof form => {
    const fields: (keyof typeof form)[] = ['fear', 'evidenceFor', 'evidenceAgainst', 'balancedThought', 'nextStep'];
    return fields[step];
  };

  const canAdvance = form[currentField()].trim().length > 0;

  const goNext = () => {
    setDirection(1);
    if (step < steps.length - 1) setStep(step + 1);
  };

  const goPrev = () => {
    setDirection(-1);
    if (step > 0) setStep(step - 1);
  };

  const finish = () => {
    onComplete({
      type: 'thought_reframing',
      ...form,
      moodBefore,
      moodAfter,
      completedAt: new Date().toISOString(),
    });
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="wizard">
      <div className="wizard__progress">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`wizard__step-dot ${i <= step ? 'wizard__step-dot--active' : ''} ${i === step ? 'wizard__step-dot--current' : ''}`}
          >
            {i < step ? <Check size={12} /> : i + 1}
          </div>
        ))}
        <div className="wizard__progress-bar">
          <div className="wizard__progress-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="wizard__mood-section">
          <span className="label">How anxious do you feel right now?</span>
          <div className="mood-selector">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map((m) => (
              <button
                key={m}
                className={`mood-dot ${moodBefore === m ? 'mood-dot--active' : ''}`}
                style={{ background: `var(--mood-${m})` }}
                onClick={() => setMoodBefore(m)}
                title={moodLabels[m]}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="wizard__content"
        >
          <h3>{steps[step].title}</h3>
          <p className="wizard__desc">{steps[step].description}</p>
          <textarea
            className="input wizard__textarea"
            value={form[currentField()]}
            onChange={(e) => setForm({ ...form, [currentField()]: e.target.value })}
            placeholder="Type your thoughts here..."
            autoFocus
          />
        </motion.div>
      </AnimatePresence>

      {step === steps.length - 1 && (
        <div className="wizard__mood-section">
          <span className="label">How do you feel now?</span>
          <div className="mood-selector">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map((m) => (
              <button
                key={m}
                className={`mood-dot ${moodAfter === m ? 'mood-dot--active' : ''}`}
                style={{ background: `var(--mood-${m})` }}
                onClick={() => setMoodAfter(m)}
                title={moodLabels[m]}
              />
            ))}
          </div>
        </div>
      )}

      <div className="wizard__nav">
        <button className="btn btn-ghost" onClick={step === 0 ? onCancel : goPrev}>
          {step === 0 ? 'Cancel' : <><ChevronLeft size={16} /> Back</>}
        </button>
        {step < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={goNext} disabled={!canAdvance}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={finish} disabled={!canAdvance}>
            <Check size={16} /> Complete
          </button>
        )}
      </div>
    </div>
  );
}
