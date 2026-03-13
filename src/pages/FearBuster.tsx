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
import { useAuth } from '../components/Auth/AuthContext';
import { useFirestore } from '../lib/firestore';
import type { TherapyLog, ExerciseType } from '../types';

import ThoughtReframing from '../components/CBT/ThoughtReframing';
import Grounding54321 from '../components/CBT/Grounding54321';
import WorryTime from '../components/CBT/WorryTime';
import DbtTipp from '../components/Therapy/DbtTipp';
import ActValues from '../components/Therapy/ActValues';
import ExposureLadder from '../components/Therapy/ExposureLadder';

// Specialized Modules
import DbtStop from '../components/Therapy/DbtStop';
import DbtRadicalAcceptance from '../components/Therapy/DbtRadicalAcceptance';
import ActDefusion from '../components/Therapy/ActDefusion';
import ActPassenger from '../components/Therapy/ActPassenger';
import CbtDistortions from '../components/Therapy/CbtDistortions';
import CbtBehavioralActivation from '../components/Therapy/CbtBehavioralActivation';
import AdhdDopamineMenu from '../components/Therapy/AdhdDopamineMenu';
import ProdEisenhower from '../components/Therapy/ProdEisenhower';
import AntiPerfectionismMvo from '../components/Therapy/AntiPerfectionismMvo';

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
  },
  // New DBT
  {
    id: 'dbt_stop',
    title: 'STOP Skill',
    desc: 'Halt impulsive actions with mindfulness.',
    category: 'DBT',
    icon: <Shield size={24} />,
    color: 'var(--priority-urgent)',
  },
  {
    id: 'dbt_radical_acceptance',
    title: 'Radical Acceptance',
    desc: 'Stop fighting reality to reduce suffering.',
    category: 'DBT',
    icon: <Info size={24} />,
    color: 'var(--accent-tasks)',
  },
  // New ACT
  {
    id: 'act_defusion',
    title: 'Leaves on a Stream',
    desc: 'Visualize thoughts drifting away.',
    category: 'ACT',
    icon: <Wind size={24} />,
    color: 'var(--accent)',
  },
  {
    id: 'act_passenger',
    title: 'The Life Bus',
    desc: 'Drive toward values despite difficult thoughts.',
    category: 'ACT',
    icon: <Zap size={24} />,
    color: 'var(--accent-journal)',
  },
  // New CBT
  {
    id: 'cbt_distortions',
    title: 'Distortion Identifier',
    desc: 'Break down the logic of negative thoughts.',
    category: 'CBT',
    icon: <BrainCircuit size={24} />,
    color: 'var(--accent-fear)',
  },
  {
    id: 'cbt_behavioral_activation',
    title: 'Behavioral Activation',
    desc: 'Break cycles with achievable micro-wins.',
    category: 'CBT',
    icon: <Zap size={24} />,
    color: 'var(--accent)',
  },
  // New ADHD/Prod
  {
    id: 'adhd_dopamine_menu',
    title: 'Dopamine Menu',
    desc: 'Healthy stimulation for ADHD minds.',
    category: 'ACT', // Grouped in therapeutic hub for now
    icon: <Zap size={24} />,
    color: 'var(--accent-tasks)',
  },
  {
    id: 'prod_eisenhower',
    title: 'Eisenhower Matrix',
    desc: 'Priority board for intense focus.',
    category: 'CBT',
    icon: <BarChart3 size={24} />,
    color: 'var(--accent-journal)',
  },
  {
    id: 'anti_perfectionism_mvo',
    title: 'MVO Builder',
    desc: 'Minimum Viable Outcome construction.',
    category: 'CBT',
    icon: <Zap size={24} />,
    color: 'var(--accent-fear)',
  }
];

export default function FearBuster() {
  const { user } = useAuth();
  const { subscribeToCollection, addDocument, removeDocument } = useFirestore(user!.uid);

  const [logs, setLogs] = useState<TherapyLog[]>([]);
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'CBT' | 'DBT' | 'ACT'>('All');

  useEffect(() => {
    const unsubscribe = subscribeToCollection<TherapyLog>('therapy_logs', (data) => {
      setLogs(data);
    });
    return () => unsubscribe();
  }, [user]);

  const onExerciseComplete = async (data: any) => {
    const logData = {
      type: activeExercise!,
      moodBefore: data.moodBefore,
      moodAfter: data.moodAfter,
      data: data,
    };
    await addDocument('therapy_logs', logData);
    setActiveExercise(null);
  };

  const deleteLog = async (id: string) => {
    await removeDocument('therapy_logs', id);
  };

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

            <motion.div 
              layout
              className="exercise-grid"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredExercises.map((ex, index) => (
                  <motion.button
                    key={ex.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.34, 1.56, 0.64, 1],
                      delay: index * 0.03 
                    }}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
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
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 90 }}
                    >
                      <Plus size={20} className="exercise-card__plus" />
                    </motion.div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

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
                        {log.type === 'cbt_exposure' && <p>Progressed on: <em>{log.data.fear}</em></p>}
                        
                        {/* New Summaries */}
                        {log.type === 'dbt_stop' && <p>Crisis halted with STOP skill.</p>}
                        {log.type === 'dbt_radical_acceptance' && <p>Accepted: <em>{log.data.reality}</em></p>}
                        {log.type === 'act_defusion' && <p>Observed {log.data.totalObserved} leaves on the stream.</p>}
                        {log.type === 'act_passenger' && <p>Kept driving with {log.data.passengers?.length || 0} passengers.</p>}
                        {log.type === 'cbt_distortions' && <p>Analyzed thought: <em>{log.data.thought}</em></p>}
                        {log.type === 'cbt_behavioral_activation' && <p>Completed {log.data.tasks?.length || 0} micro-missions.</p>}
                        {log.type === 'adhd_dopamine_menu' && <p>Updated healthy stimulation menu.</p>}
                        {log.type === 'prod_eisenhower' && <p>Prioritized {log.data.tasks?.length || 0} focus tasks.</p>}
                        {log.type === 'anti_perfectionism_mvo' && <p>MVO defined for: <em>{log.data.dauntingTask}</em></p>}
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

                          {/* New Details */}
                          {log.type === 'dbt_stop' && (
                            <div className="log-details-grid" style={{ fontSize: 'var(--text-xs)' }}>
                              <div><strong>Observe:</strong> {log.data.observation}</div>
                              <div><strong>Proceed:</strong> {log.data.mindfulAction}</div>
                            </div>
                          )}
                          {log.type === 'dbt_radical_acceptance' && (
                            <div className="log-details-grid" style={{ fontSize: 'var(--text-xs)' }}>
                              <div><strong>Reality:</strong> {log.data.reality}</div>
                              <div><strong>Causes:</strong> {log.data.causes}</div>
                            </div>
                          )}
                          {log.type === 'cbt_distortions' && (
                            <div style={{ fontSize: 'var(--text-xs)' }}>
                              <div style={{ marginBottom: '8px' }}><strong>Distortions:</strong> {log.data.selectedDistortions?.join(', ')}</div>
                              <div><strong>Balanced Insight:</strong> {log.data.balancedThought}</div>
                            </div>
                          )}
                          {log.type === 'adhd_dopamine_menu' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: 'var(--text-xxs)' }}>
                               {Object.entries(log.data || {}).map(([key, items]: any) => (
                                 <div key={key}><strong>{key.toUpperCase()}:</strong> {items.length}</div>
                               ))}
                            </div>
                          )}
                          {log.type === 'prod_eisenhower' && (
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                               {log.data.tasks?.map((t: any) => (
                                 <span key={t.id} className="badge" style={{ fontSize: '9px', background: 'var(--bg-elevated)' }}>{t.text}</span>
                               ))}
                             </div>
                          )}
                          {log.type === 'anti_perfectionism_mvo' && (
                             <div style={{ fontSize: 'var(--text-xs)' }}>
                               <div><strong>Goal:</strong> {log.data.mvoDefinition}</div>
                               <div><strong>Limit:</strong> {log.data.timeLimit}m</div>
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
            
            {/* New Exercises */}
            {activeExercise === 'dbt_stop' && <DbtStop onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'dbt_radical_acceptance' && <DbtRadicalAcceptance onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'act_defusion' && <ActDefusion onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'act_passenger' && <ActPassenger onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'cbt_distortions' && <CbtDistortions onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'cbt_behavioral_activation' && <CbtBehavioralActivation onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'adhd_dopamine_menu' && <AdhdDopamineMenu onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'prod_eisenhower' && <ProdEisenhower onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
            {activeExercise === 'anti_perfectionism_mvo' && <AntiPerfectionismMvo onComplete={onExerciseComplete} onCancel={() => setActiveExercise(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
