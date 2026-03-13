import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, HelpCircle, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function DbtRadicalAcceptance({ onComplete, onCancel }: Props) {
  const [formData, setFormData] = useState({
    reality: '',
    causes: '',
    avoidance: '',
    accepted: false
  });

  const isFormValid = formData.reality && formData.causes && formData.avoidance && formData.accepted;

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Anchor className="text-accent" size={28} />
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', lineHeight: '1' }}>Radical Acceptance</h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
              Stop fighting reality. Accept what is, to reduce suffering.
            </p>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Field 1 */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <HelpCircle size={16} className="text-accent" />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>What is the reality I am fighting?</h3>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
            State the facts of the situation without judgment.
          </p>
          <textarea 
            className="input" 
            style={{ width: '100%', minHeight: '80px' }}
            placeholder="e.g., I did not get the promotion I worked hard for."
            value={formData.reality}
            onChange={(e) => setFormData(prev => ({ ...prev, reality: e.target.value }))}
          />
        </section>

        {/* Field 2 */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <AlertCircle size={16} style={{ color: 'var(--accent-journal)' }} />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>What are the causes that led to this reality?</h3>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
            Recognize that this moment is the result of many factors.
          </p>
          <textarea 
            className="input" 
            style={{ width: '100%', minHeight: '80px' }}
            placeholder="e.g., The budget was cut, three other seniors applied, I missed one deadline..."
            value={formData.causes}
            onChange={(e) => setFormData(prev => ({ ...prev, causes: e.target.value }))}
          />
        </section>

        {/* Field 3 */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <HelpCircle size={16} style={{ color: 'var(--accent-fear)' }} />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>What am I avoiding by fighting this?</h3>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
            Usually we fight reality to avoid feeling pain, grief, or shame.
          </p>
          <textarea 
            className="input" 
            style={{ width: '100%', minHeight: '80px' }}
            placeholder="e.g., If I accept this, I have to feel the sadness of failure."
            value={formData.avoidance}
            onChange={(e) => setFormData(prev => ({ ...prev, avoidance: e.target.value }))}
          />
        </section>

        {/* Commitment */}
        <motion.div 
          className="glass-card" 
          whileHover={{ scale: 1.01 }}
          style={{ 
            padding: 'var(--space-4)', 
            background: formData.accepted ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-elevated)',
            border: formData.accepted ? '1px solid var(--accent)' : '1px solid var(--border)',
            cursor: 'pointer'
          }}
          onClick={() => setFormData(prev => ({ ...prev, accepted: !prev.accepted }))}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '4px', 
              border: '2px solid var(--accent)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              background: formData.accepted ? 'var(--accent)' : 'transparent'
            }}>
              {formData.accepted && <CheckCircle2 size={16} color="white" />}
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>
              I commit to accepting this reality as it is in this moment.
            </span>
          </div>
        </motion.div>

        <footer style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            <ArrowLeft size={16} /> Cancel
          </button>
          <button 
            className="btn btn-primary" 
            disabled={!isFormValid}
            onClick={() => onComplete(formData)}
          >
            Log Entry <CheckCircle2 size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}
