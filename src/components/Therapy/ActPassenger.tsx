import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Compass, ArrowLeft, Plus, X, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

interface Passenger {
  id: string;
  name: string;
}

export default function ActPassenger({ onComplete, onCancel }: Props) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [newPassenger, setNewPassenger] = useState('');
  const [isDriving, setIsDriving] = useState(false);

  const addPassenger = () => {
    if (!newPassenger.trim()) return;
    setPassengers([...passengers, { id: Math.random().toString(), name: newPassenger }]);
    setNewPassenger('');
  };

  const removePassenger = (id: string) => {
    setPassengers(passengers.filter(p => p.id !== id));
  };

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>The Passenger on the Bus</h2>
        <p className="text-muted">You are the driver of your life. Your fears and doubts are just passengers. They can be loud, but they don't have the wheel.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Step 1: Identify Passengers */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <Users size={20} className="text-accent" />
            <h3 style={{ fontSize: 'var(--text-base)' }}>Who is on your bus?</h3>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
            Nature of thoughts: "The Critic", "The Worry", "The Perfectionist"...
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              className="input"
              style={{ flex: 1 }}
              placeholder="Name a difficult thought..."
              value={newPassenger}
              onChange={(e) => setNewPassenger(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPassenger()}
            />
            <button className="btn btn-secondary" onClick={addPassenger} disabled={!newPassenger.trim()}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <AnimatePresence>
              {passengers.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="glass-card"
                  style={{ 
                    padding: 'var(--space-2) var(--space-3)', 
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)' 
                  }}
                >
                  <User size={14} className="text-accent" />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600' }}>{p.name}</span>
                  <button 
                    onClick={() => removePassenger(p.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Step 2: Visualization */}
        <motion.section 
          animate={{ opacity: passengers.length > 0 ? 1 : 0.5 }}
          style={{ 
            padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', 
            background: 'var(--bg-dark)', border: '1px dashed var(--border)',
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}
        >
          <motion.div
            animate={isDriving ? { x: [0, -500] } : {}}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ 
              position: 'absolute', top: '0', left: '0', width: '200%', height: '100%',
              opacity: 0.05, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
              backgroundSize: '40px 100%'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
              <motion.div
                animate={isDriving ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: 'var(--accent)' }}
              >
                <Compass size={64} />
              </motion.div>
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>Take the Wheel</h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
              The passengers are shouting directions. But only you decide where the bus goes. Keep driving toward your values.
            </p>
            
            <button 
              className={`btn ${isDriving ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setIsDriving(!isDriving)}
              disabled={passengers.length === 0}
            >
              {isDriving ? 'Keep Driving...' : 'Start Driving'}
            </button>
          </div>
        </motion.section>

        <footer style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            <ArrowLeft size={16} /> Cancel
          </button>
          <button 
            className="btn btn-primary" 
            disabled={passengers.length === 0 || !isDriving}
            onClick={() => onComplete({ passengers: passengers.map(p => p.name) })}
          >
            Finish Journey <CheckCircle2 size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}
