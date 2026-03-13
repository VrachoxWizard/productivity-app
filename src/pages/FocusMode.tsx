import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Timer, 
  Zap, 
  Coffee, 
  ChevronDown, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  Music,
  EyeOff,
  Eye,
  Activity
} from 'lucide-react';
import { loadData, saveData, generateId } from '../lib/storage';
import type { FocusSession, Task } from '../types';
import { useSound } from '../hooks/useSound';
import './FocusMode.css';

const presets = [
  { type: 'pomodoro' as const, label: 'Pomodoro', duration: 25, icon: <Timer size={16} /> },
  { type: 'deep-work' as const, label: 'Deep Work', duration: 50, icon: <Zap size={16} /> },
  { type: 'custom' as const, label: 'Short Break', duration: 5, icon: <Coffee size={16} /> },
];

const ambientSounds = [
  { id: 'rain', label: 'Rain', url: 'https://www.soundjay.com/nature/rain-01.mp3' },
  { id: 'forest', label: 'Forest', url: 'https://www.soundjay.com/nature/forest-01.mp3' },
  { id: 'noise', label: 'Brown Noise', url: 'https://www.soundjay.com/misc/sounds/white-noise-01.mp3' },
  { id: 'waves', label: 'Waves', url: 'https://www.soundjay.com/nature/ocean-wave-1.mp3' },
];

const CIRCUMFERENCE = 2 * Math.PI * 120;

export default function FocusMode() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [totalSeconds, setTotalSeconds] = useState(presets[0].duration * 60);
  const [remaining, setRemaining] = useState(presets[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  
  // Audio Mixer State
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  const { playSound } = useSound();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Zen & Focus View Effects
  useEffect(() => {
    if (isZenMode) document.body.classList.add('zen-mode');
    else document.body.classList.remove('zen-mode');
    
    if (isRunning) document.body.classList.add('focus-view');
    else document.body.classList.remove('focus-view');

    return () => {
      document.body.classList.remove('zen-mode', 'focus-view');
    };
  }, [isZenMode, isRunning]);

  useEffect(() => {
    setSessions(loadData<FocusSession[]>('focus_sessions', []));
    setTasks(loadData<Task[]>('tasks', []).filter(t => !t.completed));
  }, []);

  const persist = useCallback((updated: FocusSession[]) => {
    setSessions(updated);
    saveData('focus_sessions', updated);
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      timerRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            const session: FocusSession = {
              id: generateId(),
              type: selectedPreset.type,
              durationMinutes: selectedPreset.duration,
              completedMinutes: selectedPreset.duration,
              completed: true,
              createdAt: new Date().toISOString(),
            };
            persist([session, ...sessions]);
            playSound('success');
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, remaining, selectedPreset, sessions, persist, playSound]);

  const selectPreset = (preset: typeof presets[number]) => {
    if (isRunning) return;
    setSelectedPreset(preset);
    setTotalSeconds(preset.duration * 60);
    setRemaining(preset.duration * 60);
  };

  const toggleTimer = () => {
    playSound('click');
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playSound('pop');
    setIsRunning(false);
    setRemaining(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleMixerSound = useCallback((id: string) => {
    const sound = ambientSounds.find(s => s.id === id);
    if (!sound) return;

    if (activeSounds[id]) {
      audioRefs.current[id]?.pause();
      setActiveSounds(prev => ({ ...prev, [id]: false }));
    } else {
      if (!audioRefs.current[id]) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audioRefs.current[id] = audio;
      }
      audioRefs.current[id].play().catch(() => {});
      setActiveSounds(prev => ({ ...prev, [id]: true }));
    }
  }, [activeSounds]);

  const progress = 1 - remaining / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - progress);
  const activeTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  return (
    <div className={`focus-page ${isRunning ? 'focus-page--running' : ''} ${isZenMode ? 'focus-page--zen' : ''}`}>
      {!isZenMode && (
        <div className="focus-page__header">
          <h1>Focus Mode</h1>
          <p>Deep concentration, powered by science.</p>
        </div>
      )}

      <div className="focus-layout">
        <div className="focus-main">
          {!isZenMode && !isBreathing && (
            <div className="focus-page__presets">
              {presets.map((p) => (
                <button
                  key={p.type}
                  className={`preset-btn glass-card ${selectedPreset.type === p.type ? 'preset-btn--active' : ''}`}
                  onClick={() => selectPreset(p)}
                  disabled={isRunning}
                >
                  {p.icon}
                  <span className="preset-btn__label">{p.label}</span>
                  <span className="preset-btn__duration">{p.duration}m</span>
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isBreathing ? (
              <motion.div key="timer" className="timer-ring-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={`timer-aura ${isRunning ? 'active' : ''}`} />
                <svg className="timer-ring" viewBox="0 0 260 260">
                  <circle cx="130" cy="130" r="120" fill="none" stroke="var(--bg-elevated)" strokeWidth="4" />
                  <motion.circle cx="130" cy="130" r="120" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} transform="rotate(-90 130 130)" />
                </svg>
                <div className="timer-ring__display">
                  <span className="timer-ring__time">{formatTime(remaining)}</span>
                  {!isZenMode && <span className="timer-ring__label">{selectedPreset.label}</span>}
                  {activeTask && isRunning && (
                    <motion.div className="timer-ring__task" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <strong>{activeTask.title}</strong>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="breathing" className="breathing-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MemoizedBreathingGuide />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="focus-page__controls">
            {!isBreathing && (
              <>
                <button className="btn btn-ghost btn-icon" onClick={resetTimer}><RotateCcw size={20} /></button>
                <button className={`btn focus-page__play-btn ${isRunning ? 'focus-page__play-btn--active' : ''}`} onClick={toggleTimer}>
                  {isRunning ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className={`btn btn-ghost btn-icon ${isZenMode ? 'active' : ''}`} onClick={() => setIsZenMode(!isZenMode)} title="Toggle Zen Mode">
                  {isZenMode ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </>
            )}
            <button className={`btn btn-ghost ${isBreathing ? 'btn-primary' : ''}`} onClick={() => setIsBreathing(!isBreathing)}>
              <Wind size={18} /> {isBreathing ? 'Timer' : 'Breathe'}
            </button>
          </div>
        </div>

        {!isZenMode && !isBreathing && (
          <aside className="focus-sidebar">
             <div className="focus-card glass-card">
              <div className="focus-card__header"><Activity size={16} /> <span>Focus Intensity</span></div>
              <FocusHeatmap sessions={sessions} />
            </div>

            <div className="focus-card glass-card">
              <div className="focus-card__header"><CheckCircle2 size={16} /> <span>Current Goal</span></div>
              <div className="focus-tasks-list">
                {tasks.map(t => (
                  <button key={t.id} className={`focus-task-item ${selectedTaskId === t.id ? 'active' : ''}`} onClick={() => setSelectedTaskId(selectedTaskId === t.id ? null : t.id)} disabled={isRunning}>
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="focus-card glass-card">
              <div className="focus-card__header"><Music size={16} /> <span>Sound Mixer</span></div>
              <div className="focus-sounds-grid">
                {ambientSounds.map(s => (
                  <button key={s.id} className={`sound-btn ${activeSounds[s.id] ? 'active' : ''}`} onClick={() => toggleMixerSound(s.id)}>
                    {activeSounds[s.id] ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function FocusHeatmap({ sessions }: { sessions: FocusSession[] }) {
  const hours = useMemo(() => {
    const counts = Array(24).fill(0);
    const now = new Date();
    sessions.filter(s => s.completed).forEach(s => {
      const date = new Date(s.createdAt);
      if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
        counts[date.getHours()]++;
      }
    });
    return counts;
  }, [sessions]);

  return (
    <div className="heatmap">
      {hours.map((v, i) => (
        <div key={i} className="heatmap-cell" style={{ opacity: 0.1 + (Math.min(v, 4) * 0.2), background: v > 0 ? 'var(--accent)' : 'var(--bg-elevated)' }} title={`${v} sessions at ${i}:00`} />
      ))}
    </div>
  );
}

const MemoizedBreathingGuide = memo(function BreathingGuide() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  useEffect(() => {
    const cycle = () => { setPhase('in'); setTimeout(() => setPhase('hold'), 4000); setTimeout(() => setPhase('out'), 7000); };
    cycle();
    const interval = setInterval(cycle, 11000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="breathing">
      <motion.div className="breathing__circle" animate={{ scale: phase === 'in' || phase === 'hold' ? 1.3 : 1, boxShadow: phase === 'hold' ? '0 0 60px var(--accent-glow)' : '0 0 20px var(--accent-glow)' }} transition={{ duration: phase === 'hold' ? 0.3 : 4 }} />
      <p className="breathing__label">{phase === 'in' ? 'Breathe in…' : phase === 'hold' ? 'Hold…' : 'Breathe out…'}</p>
    </div>
  );
});
