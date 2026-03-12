import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckSquare, Calendar, ArrowRight, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const timeOptions = [
  { label: 'In 1 hour', value: '1h' },
  { label: 'Evening (6 PM)', value: '6pm' },
  { label: 'Tomorrow morning', value: 'tomorrow_am' },
];

export default function WorryTime({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [worry, setWorry] = useState('');
  const [isSolvable, setIsSolvable] = useState<boolean | null>(null);
  const [solution, setSolution] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const finish = () => {
    onComplete({
      type: 'worry_time',
      worry,
      isSolvable,
      solution: isSolvable ? solution : null,
      scheduledTime: !isSolvable ? scheduledTime : null,
      completedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="cbt-exercise worry-time">
      <div className="cbt-exercise__header">
        <h2>Worry Postponement</h2>
        <p>Don't let worry take over your now. Process it intentionally.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1" 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="worry-step"
          >
            <label className="label">What is on your mind?</label>
            <textarea 
              className="input" 
              placeholder="Describe the worry..."
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!worry.trim()}>
              Next <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="worry-step"
          >
            <h3>Can you do something about this right now?</h3>
            <div className="worry-choice-grid">
              <button 
                className={`worry-choice glass-card ${isSolvable === true ? 'active' : ''}`}
                onClick={() => setIsSolvable(true)}
              >
                <CheckSquare size={32} />
                <span>Yes, I can act.</span>
              </button>
              <button 
                className={`worry-choice glass-card ${isSolvable === false ? 'active' : ''}`}
                onClick={() => setIsSolvable(false)}
              >
                <Clock size={32} />
                <span>No, it's out of my control.</span>
              </button>
            </div>
            {isSolvable !== null && (
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                Continue
              </button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="worry-step"
          >
            {isSolvable ? (
              <>
                <label className="label">What is one small step you can take right now?</label>
                <textarea 
                  className="input" 
                  placeholder="Actionable plan..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={finish} disabled={!solution.trim()}>
                  Complete & Act
                </button>
              </>
            ) : (
              <>
                <h3>Schedule "Worry Time"</h3>
                <p className="worry-subtext">Acknowledge the worry, then set it aside until your scheduled time.</p>
                <div className="time-presets">
                  {timeOptions.map(opt => (
                    <button 
                      key={opt.value}
                      className={`btn btn-sm ${scheduledTime === opt.value ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setScheduledTime(opt.value)}
                    >
                      <Calendar size={14} /> {opt.label}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={finish} disabled={!scheduledTime}>
                  Set Aside & Refresh
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cbt-exercise__footer" style={{ marginTop: 'auto' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        {step > 1 && (
          <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>
        )}
      </div>
    </div>
  );
}
