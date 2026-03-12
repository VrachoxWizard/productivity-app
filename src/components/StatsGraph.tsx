import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  data: number[]; // Values between 1-5
  color?: string;
  height?: number;
}

export default function StatsGraph({ data, color = 'var(--accent)', height = 40 }: Props) {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    
    const width = 100; // viewBox width
    const maxY = 5;
    const minY = 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      // Invert Y for SVG (0 is top)
      const y = height - ((val - minY) / (maxY - minY)) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, height]);

  if (data.length < 2) {
    return (
      <div className="stats-graph-empty" style={{ height: `${height}px` }}>
        Not enough data
      </div>
    );
  }

  return (
    <div className="stats-graph" style={{ height: `${height}px`, width: '100%' }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill Area */}
        <motion.polyline
          points={`${points} 100,${height} 0,${height}`}
          fill="url(#graphGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Dots for each point */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = height - ((val - 1) / 4) * height;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="var(--bg-card)"
              stroke={color}
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}
