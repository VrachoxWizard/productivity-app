import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Leaf, ArrowLeft, Send } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

interface ThoughtLeaf {
  id: string;
  text: string;
  delay: number;
}

export default function ActDefusion({ onComplete, onCancel }: Props) {
  const [currentThought, setCurrentThought] = useState('');
  const [leaves, setLeaves] = useState<ThoughtLeaf[]>([]);
  const [totalPlaced, setTotalPlaced] = useState(0);

  const placeOnLeaf = () => {
    if (!currentThought.trim()) return;
    
    const newLeaf: ThoughtLeaf = {
      id: Math.random().toString(36).substr(2, 9),
      text: currentThought,
      delay: Math.random() * 2 // slight randomness
    };

    setLeaves(prev => [...prev, newLeaf]);
    setCurrentThought('');
    setTotalPlaced(prev => prev + 1);

    // Auto-remove leaf after animation
    setTimeout(() => {
      setLeaves(prev => prev.filter(l => l.id !== newLeaf.id));
    }, 15000);
  };

  return (
    <div className="exercise-container glass-card" style={{ 
      maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8)',
      minHeight: '600px', display: 'flex', flexDirection: 'column'
    }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>Leaves on a Stream</h2>
        <p className="text-muted">Place your thoughts on leaves and watch them drift by. Do not fight them, just observe.</p>
      </header>

      {/* Animation Area */}
      <div style={{ 
        flex: 1, position: 'relative', background: 'rgba(0,0,0,0.1)', 
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        border: '1px solid var(--border)', marginBottom: 'var(--space-6)',
        backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(var(--accent-rgb), 0.05) 100%)'
      }}>
        {/* Stream Visualizer (Simple) */}
        <div style={{ 
          position: 'absolute', top: '50%', width: '100%', height: '2px', 
          background: 'rgba(var(--accent-rgb), 0.1)', transform: 'translateY(-50%)' 
        }} />

        <AnimatePresence>
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{ x: '-10%', y: '40%', opacity: 0 }}
              animate={{ 
                x: '110%', 
                y: ['40%', '45%', '35%', '40%'], // Wavering motion
                opacity: 1 
              }}
              transition={{ 
                x: { duration: 12, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                delay: leaf.delay
              }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-4)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(4px)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(var(--accent-rgb), 0.2)',
                boxShadow: 'var(--shadow-sm)',
                maxWidth: '200px'
              }}
            >
              <Leaf size={16} fill="var(--accent)" stroke="var(--accent)" opacity={0.6} />
              <span style={{ 
                fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', 
                overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)'
              }}>
                {leaf.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {leaves.length === 0 && (
          <div style={{ 
            position: 'absolute', inset: 0, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
            flexDirection: 'column', gap: 'var(--space-4)', pointerEvents: 'none'
          }}>
            <Wind size={40} opacity={0.3} className="animate-float" />
            <span style={{ fontSize: 'var(--text-sm)' }}>The stream is quiet.</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="I am worried about my deadline..."
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && placeOnLeaf()}
        />
        <button 
          className="btn btn-primary" 
          onClick={placeOnLeaf}
          disabled={!currentThought.trim()}
        >
          Place on Leaf <Send size={18} />
        </button>
      </div>

      <footer style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          <ArrowLeft size={16} /> Cancel
        </button>
        <div style={{ textAlign: 'right' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-xxs)', marginBottom: 'var(--space-1)' }}>
            {totalPlaced} thoughts observed
          </p>
          <button 
            className="btn btn-secondary" 
            disabled={totalPlaced < 1}
            onClick={() => onComplete({ totalObserved: totalPlaced })}
          >
            Finish & Log
          </button>
        </div>
      </footer>
    </div>
  );
}
