import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ChevronRight, 
  X, 
  Calendar, 
  ArrowRight, 
  Wind, 
  Clock, 
  Plus, 
  BrainCircuit, 
  Trash2,
  ChevronDown,
  Info,
  Droplet,
  Zap,
  Target,
  BarChart3,
  Search
} from 'lucide-react';
import { loadData, saveData, generateId } from '../lib/storage';
import type { TherapyLog, ExerciseType } from '../types';

import ThoughtReframing from '../components/CBT/ThoughtReframing';
import Grounding54321 from '../components/CBT/Grounding54321';
import WorryTime from '../components/CBT/WorryTime';
import DbtTipp from '../components/Therapy/DbtTipp';
import ActValues from '../components/Therapy/ActValues';
import ExposureLadder from '../components/Therapy/ExposureLadder';

import './FearBuster.css';

interface ExerciseDef {
  id: ExerciseType;
  title: string;
  desc: string;
  category: 'CBT' | 'DBT' | 'ACT';
  icon: React.ReactNode;
  color: string;
}

const ALL_EXERCISES: ExerciseDef[] = [
  {
    id: 'thought_reframing',
    title: 'Thought Reframing',
    desc: 'Bust anxious thoughts with logic and evidence.',
    category: 'CBT',
    icon: <BrainCircuit size={24} />,
    color: 'var(--accent-fear)',
  },
  {
    id: 'worry_time',
    title: 'Worry Postponement',
    desc: 'Set a scheduled time for nagging worries.',
    category: 'CBT',
    icon: <Clock size={24} />,
    color: 'var(--accent-journal)',
  },
  {
    id: 'cbt_exposure',
    title: 'Exposure Ladder',
    desc: 'Systematically face fears in small steps.',
    category: 'CBT',
    icon: <Target size={24} />,
    color: 'var(--accent-tasks)',
  },
  {
    id: 'grounding_54321',
    title: '5-4-3-2-1 Grounding',
    desc: 'Reconnect with your body and surroundings.',
    category: 'DBT',
    icon: <Wind size={24} />,
    color: 'var(--accent)',
  },
  {
    id: 'dbt_tipp',
    title: 'TIPP Crisis Skill',
    desc: 'Lower emotional intensity fast with biology.',
    category: 'DBT',
    icon: <Droplet size={24} />,
    color: 'var(--priority-urgent)',
  },
  {
    id: 'act_values',
    title: 'Value Card Sort',
    desc: 'Identify what truly matters to you.',
    category: 'ACT',
    icon: <BarChart3 size={24} />,
    color: 'var(--accent-journal)',
  }
];

export default function FearBuster() {
  const [logs, setLogs] = useState<TherapyLog[]>([]);
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'CBT' | 'DBT' | 'ACT'>('All');

  useEffect(() => {
    setLogs(loadData<TherapyLog[]>('therapy_logs', []));
  }, []);

  const persist = useCallback((updated: TherapyLog[]) => {
    setLogs(updated);
    saveData('therapy_logs', updated);
  }, []);

  const onExerciseComplete = (data: any) => {
    const log: TherapyLog = {
      id: generateId(),
      type: activeExercise!,
      moodBefore: data.moodBefore,
      moodAfter: data.moodAfter,
      data: data,
      createdAt: new Date().toISOString(),
    };
    persist([log, ...logs]);
    setActiveExercise(null);
  };

  const deleteLog = (id: string) => persist(logs.filter(l => l.id !== id));

  const filteredExercises = useMemo(() => {
    return ALL_EXERCISES.filter(ex => {
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           ex.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || ex.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fear-page">
      <div className="fear-page__header">
        <h1>Therapy Hub</h1>
        <p>Evidence-based tools for CBT, DBT, and ACT practice.</p>
      </div>

      <AnimatePresence mode="wait">
        {!activeExercise ? (
          <motion.div
            key="hub-dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fear-page__content"
          >
            {/* Filter Bar */}
            <div className="hub-filters">
              <div className="search-box glass-card">
                <Search size={18} />
                <input 
                  placeholder="Search exercises..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="category-tabs">
                {(['All', 'CBT', 'DBT', 'ACT'] as const).map(cat => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="exercise-grid">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  className="exercise-card glass-card"
                  onClick={() => setActiveExercise(ex.id)}
                  style={{ '--ex-color': ex.color } as any}
                >
                  <span className="exercise-card__cat-badge">{ex.category}</span>
                  <div className="exercise-card__icon">{ex.icon}</div>
                  <div className="exercise-card__info">
                    <h3>{ex.title}</h3>
                    <p>{ex.desc}</p>
                  </div>
                  <Plus size={20} className="exercise-card__plus" />
                </button>
              ))}
            </div>

            {logs.length > 0 && (
              <div className="fear-page__history">
                <h3 className="section-title">Session History ({logs.length})</h3>
                <div className="cbt-logs">
                  {logs.map((log) => (
                    <div key={log.id} className={`cbt-log glass-card ${expandedLogId === log.id ? 'expanded' : ''}`}>
                      <div className="cbt-log__header" onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}>
                        <div className="cbt-log__meta">
                          <span className="cbt-log__type-tag" style={{ background: ALL_EXERCISES.find(e => e.id === log.type)?.color + '22', color: ALL_EXERCISES.find(e => e.id === log.type)?.color }}>
                            {ALL_EXERCISES.find(e => e.id === log.type)?.title || 'Exercise'}
                          </span>
                          <span className="cbt-log__date"><Calendar size={12} /> {formatDate(log.createdAt)}</span>
                        </div>
                        <div className="cbt-log__actions">
                          <button className="btn btn-icon btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}>
                            <Trash2 size={14} />
                          </button>
                          <ChevronDown size={18} className={`expand-icon ${expandedLogId === log.id ? 'rotated' : ''}`} />
                        </div>
                      </div>
                      
                      <div className="cbt-log__summary">
                        {log.type === 'thought_reframing' && <p>Reframed: <em>{log.data.fear}</em></p>}
                        {log.type === 'grounding_54321' && <p>Sensory scan completed.</p>}
                        {log.type === 'worry_time' && <p>Worry processed: <em>{log.data.worry}</em></p>}
                        {log.type === 'dbt_tipp' && <p>Completed distress tolerance steps.</p>}
                        {log.type === 'act_values' && <p>Updated core life values.</p>}
                        {log.type === 'cbt_exposure' && <p>Progressed on: <em>{log.data.fear}</em></p>}
                      </div>

                      {expandedLogId === log.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="cbt-log__details"
                        >
                          {log.type === 'thought_reframing' && (
                            <div className="log-details-grid">
                              <div><strong>Reframed Thought:</strong> {log.data.balancedThought}</div>
                              <div><strong>Next Step:</strong> {log.data.nextStep}</div>
                            </div>
                          )}
                          {log.type === 'act_values' && (
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                               {Object.entries(log.data.values).filter(([_, p]) => p === 'top').map(([id]) => (
                                 <span key={id} className="badge" style={{ background: 'var(--accent)', color: 'var(--text-inverse)' }}>{id}</span>
                               ))}
                             </div>
                          )}
                          {log.type === 'cbt_exposure' && (
                            <div className="ladder-history-view">
                              {log.data.steps.map((s: any) => (
                                <div key={s.id} style={{ fontSize: 'var(--text-xs)', display: 'flex', gap: 'var(--space-2)', opacity: s.completed ? 1 : 0.5 }}>
                                  {s.completed ? '✅' : '⭕'} {s.title} (SUDs: {s.difficulty})
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="exercise-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="exercise-container"
          >
            {activeExercise === 'thought_reframing' && <ThoughtReframing onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'grounding_54321' && <Grounding54321 onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'worry_time' && <WorryTime onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'dbt_tipp' && <DbtTipp onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'act_values' && <ActValues onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'cbt_exposure' && <ExposureLadder onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
