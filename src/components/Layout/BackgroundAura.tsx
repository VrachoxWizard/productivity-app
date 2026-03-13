import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { memo } from 'react';

const AURA_CONFIG: Record<string, { color: string; p1: string; p2: string }> = {
  '/': { color: 'var(--accent-dashboard)', p1: '20% 20%', p2: '80% 80%' },
  '/tasks': { color: 'var(--accent-tasks)', p1: '70% 20%', p2: '10% 60%' },
  '/journal': { color: 'var(--accent-journal)', p1: '15% 70%', p2: '85% 20%' },
  '/fear-buster': { color: 'var(--accent-fear)', p1: '80% 30%', p2: '20% 70%' },
  '/focus': { color: 'var(--accent-focus)', p1: '40% 40%', p2: '60% 60%' },
};

const BackgroundAura = memo(function BackgroundAura() {
  const location = useLocation();
  const config = AURA_CONFIG[location.pathname] || AURA_CONFIG['/'];

  return (
    <div className="background-aura-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg-deep)',
      pointerEvents: 'none',
      transform: 'translateZ(0)'
    }}>
      <AnimatePresence>
        <motion.div
          key={location.pathname + '-1'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.1, 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: 'linear',
            opacity: { duration: 1.5, repeat: 0 }
          }}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: `radial-gradient(circle at ${config.p1}, ${config.color}, transparent 60%)`,
            filter: 'blur(60px)',
            willChange: 'transform, opacity'
          }}
        />
        <motion.div
          key={location.pathname + '-2'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.06, 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0]
          }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: 'linear',
            opacity: { duration: 2, repeat: 0 }
          }}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: `radial-gradient(circle at ${config.p2}, ${config.color}, transparent 55%)`,
            filter: 'blur(80px)',
            mixMode: 'plus-lighter',
            willChange: 'transform, opacity'
          } as any}
        />
      </AnimatePresence>
      
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none'
      }} />
    </div>
  );
});

export default BackgroundAura;
