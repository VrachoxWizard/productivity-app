import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AURA_CONFIG: Record<string, { color: string; p1: string; p2: string }> = {
  '/': { color: 'var(--accent-dashboard)', p1: '20% 20%', p2: '80% 80%' },
  '/tasks': { color: 'var(--accent-tasks)', p1: '70% 20%', p2: '10% 60%' },
  '/journal': { color: 'var(--accent-journal)', p1: '15% 70%', p2: '85% 20%' },
  '/fear-buster': { color: 'var(--accent-fear)', p1: '80% 30%', p2: '20% 70%' },
  '/focus': { color: 'var(--accent-focus)', p1: '40% 40%', p2: '60% 60%' },
};

export default function BackgroundAura() {
  const location = useLocation();
  const config = AURA_CONFIG[location.pathname] || AURA_CONFIG['/'];

  return (
    <div className="background-aura-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg-deep)',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        <motion.div
          key={location.pathname + '-1'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.12, 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: 'linear',
            opacity: { duration: 1.5, repeat: 0 }
          }}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: `radial-gradient(circle at ${config.p1}, ${config.color}, transparent 60%)`,
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          key={location.pathname + '-2'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.08, 
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: 'linear',
            opacity: { duration: 2, repeat: 0 }
          }}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: `radial-gradient(circle at ${config.p2}, ${config.color}, transparent 55%)`,
            filter: 'blur(120px)',
            mixMode: 'plus-lighter'
          } as any}
        />
      </AnimatePresence>
      
      {/* Subtle Grain Texture — improved opacity */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />
    </div>
  );
}
