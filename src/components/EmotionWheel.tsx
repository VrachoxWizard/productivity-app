import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  onSelect: (emotion: string) => void;
}

const EMOTIONS = [
  { label: 'Joy', color: '#FFD700', angle: 0 },
  { label: 'Peace', color: '#98FB98', angle: 60 },
  { label: 'Sadness', color: '#87CEEB', angle: 120 },
  { label: 'Anger', color: '#FF6347', angle: 180 },
  { label: 'Fear', color: '#DDA0DD', angle: 240 },
  { label: 'Awe', color: '#E0FFFF', angle: 300 },
];

export default function EmotionWheel({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="emotion-wheel-container" style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {EMOTIONS.map((e, i) => {
          const startAngle = (i * 60) - 90;
          const endAngle = ((i + 1) * 60) - 90;
          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          return (
            <motion.path
              key={e.label}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 0 1 ${x2} ${y2} Z`}
              fill={e.color}
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{ 
                opacity: hovered === e.label ? 0.8 : 0.4, 
                scale: hovered === e.label ? 1.05 : 1,
              }}
              whileHover={{ opacity: 0.9, scale: 1.1 }}
              style={{ cursor: 'pointer', stroke: 'var(--border)', strokeWidth: 0.5 }}
              onClick={() => onSelect(e.label)}
              onMouseEnter={() => setHovered(e.label)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        <circle cx="50" cy="50" r="10" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="0.5" />
      </svg>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
          {hovered || 'Mood'}
        </span>
      </div>
    </div>
  );
}
