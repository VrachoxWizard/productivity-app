import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Zap, Wind, Dumbbell, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const TIPP_STEPS = [
  {
    id: 'temperature',
    title: 'Temperature',
    icon: <Droplet size={32} />,
    description: 'Splash your face with very cold water for 15-30 seconds. This triggers the "Dive Reflex" to instantly lower your heart rate.',
    instruction: 'Go to a sink or use an ice pack. Splash your face or hold it there.',
    action: 'Start 30s Timer'
  },
  {
    id: 'intense_exercise',
    title: 'Intense Exercise',
    icon: <Zap size={32} />,
    description: 'Engage in 20-30 minutes of high-intensity exercise (jumping jacks, sprinting). Burn off that excess emotional energy.',
    instruction: 'We will do a quick 60-second burst right now. Give it 100%!',
    action: 'Start 60s Burst'
  },
  {
    id: 'paced_breathing',
    title: 'Paced Breathing',
    icon: <Wind size={32} />,
    description: 'Slow your breathing down. Inhale for 4 seconds, breathe out for 6-8 seconds.',
    instruction: 'Follow the circle. Breathe in deeply, exhale slowly.',
    action: 'Start Breathing'
  },
  {
    id: 'paired_relaxation',
    title: 'Paired Muscle Relaxation',
    icon: <Dumbbell size={32} />,
    description: 'Tense a muscle group as hard as you can while breathing in, then release it completely while breathing out.',
    instruction: 'Tense your fists, then relax...',
    action: 'Start Relaxation'
  }
];

export default function DbtTipp({ onComplete, onCancel }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setLeftTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = TIPP_STEPS[currentStepIndex];

  const startTimer = (seconds: number) => {
    setLeftTime(seconds);
    setTimerActive(true);
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setLeftTime(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const nextStep = () => {
    if (currentStepIndex < TIPP_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setTimerActive(false);
    } else {
      onComplete({ completedSteps: TIPP_STEPS.map(s => s.id) });
    }
  };

  return (
    <div className="dbt-tipp glass-card" style={{ padding: 'var(--space-8)', maxWidth: '600px', margin: '0 auto' }}>
      <div className="dbt-tipp__header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>TIPP Crisis Skills</h2>
        <p style={{ color: 'var(--text-muted)' }}>Distress tolerance for when emotions feel overwhelming.</p>
      </div>

      <div className="dbt-tipp__steps-indicator" style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
        {TIPP_STEPS.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              height: '4px', 
              flex: 1, 
              background: i <= currentStepIndex ? 'var(--accent)' : 'var(--bg-elevated)',
              borderRadius: 'var(--radius-full)',
              opacity: i === currentStepIndex ? 1 : 0.4,
              transition: 'all 0.3s ease'
            }} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="dbt-tipp__step"
          style={{ textAlign: 'center' }}
        >
          <div style={{ color: 'var(--accent)', marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
            {currentStep.icon}
          </div>
          <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>{currentStep.title}</h3>
          <p style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-lg)', lineHeight: '1.6' }}>
            {currentStep.description}
          </p>

          <div 
            className="dbt-tipp__instruction glass-card" 
            style={{ 
              padding: 'var(--space-4)', 
              background: 'rgba(255, 255, 255, 0.03)', 
              marginBottom: 'var(--space-8)',
              borderStyle: 'dashed'
            }}
          >
            <p style={{ fontSize: 'var(--text-sm)' }}>{currentStep.instruction}</p>
          </div>

          {timerActive ? (
            <div className="dbt-tipp__timer" style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ fontSize: 'var(--text-5xl)', fontWeight: '700', fontFamily: 'monospace', color: 'var(--accent)' }}>
                {timeLeft}s
              </div>
              <p style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 'var(--space-2)' }}>Keep going...</p>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: 'var(--space-5)', fontSize: 'var(--text-lg)' }}
              onClick={() => {
                if (currentStep.id === 'temperature') startTimer(30);
                else if (currentStep.id === 'intense_exercise') startTimer(60);
                else nextStep();
              }}
            >
              {currentStep.action}
            </button>
          )}

          {(!timerActive || timeLeft === 0) && (
             <button 
              className="btn btn-ghost" 
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
              onClick={nextStep}
            >
              Next Strategy <ChevronRight size={18} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 'var(--space-10)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
        <button onClick={onCancel} className="btn-ghost" style={{ fontSize: 'var(--text-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          Exit Exercise
        </button>
      </div>
    </div>
  );
}
