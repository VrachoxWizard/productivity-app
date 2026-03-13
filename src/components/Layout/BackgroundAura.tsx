import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AURA_CONFIG: Record<string, { color: string; position: string }> = {
  '/': { color: 'var(--accent-dashboard)', position: '30% 20%' },
  '/tasks': { color: 'var(--accent-tasks)', position: '70% 30%' },
  '/journal': { color: 'var(--accent-journal)', position: '20% 80%' },
  '/fear-buster': { color: 'var(--accent-fear)', position: '80% 60%' },
  '/focus': { color: 'var(--accent-focus)', position: '50% 50%' },
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
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: `radial-gradient(circle at ${config.position}, ${config.color}, transparent 60%)`,
            filter: 'blur(80px)',
          }}
        />
      </AnimatePresence>
      
      {/* Static secondary glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 10% 90%, var(--bg-surface), transparent 40%)',
        opacity: 0.5,
      }} />

      {/* Subtle Grain Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />
    </div>
  );
}
