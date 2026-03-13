import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Utensils, UtensilsCrossed, IceCream, Plus, Trash2, CheckCircle2, ArrowLeft, Info } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

type MenuCategory = 'appetizers' | 'mains' | 'sides' | 'desserts';

interface MenuItem {
  id: string;
  text: string;
}

const CATEGORIES: Record<MenuCategory, { title: string; icon: any; desc: string; color: string }> = {
  appetizers: { title: 'Appetizers', icon: Coffee, desc: 'Quick 5-10 min hits (stretching, water, music).', color: 'var(--accent-tasks)' },
  mains: { title: 'Mains', icon: UtensilsCrossed, desc: 'Engaging, deep activities (hobbies, deep work).', color: 'var(--accent)' },
  sides: { title: 'Sides', icon: Utensils, desc: 'Background stimulation (lo-fi, podcasts).', color: 'var(--accent-journal)' },
  desserts: { title: 'Desserts', icon: IceCream, desc: 'Guilty pleasures (social media, TV) - use sparingly.', color: 'var(--accent-fear)' }
};

export default function AdhdDopamineMenu({ onComplete, onCancel }: Props) {
  const [activeTab, setActiveTab] = useState<MenuCategory>('appetizers');
  const [items, setItems] = useState<Record<MenuCategory, MenuItem[]>>({
    appetizers: [],
    mains: [],
    sides: [],
    desserts: []
  });
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { id: Math.random().toString(), text: newItem }]
    }));
    setNewItem('');
  };

  const removeItem = (cat: MenuCategory, id: string) => {
    setItems(prev => ({
      ...prev,
      [cat]: prev[cat].filter(i => i.id !== id)
    }));
  };

  const totalItems = Object.values(items).flat().length;

  return (
    <div className="exercise-container glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>The Dopamine Menu</h2>
        <p className="text-muted">Plan your stimulation so you don't default to doom-scrolling.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {(Object.keys(CATEGORIES) as MenuCategory[]).map(cat => {
          const Icon = CATEGORIES[cat].icon;
          return (
            <button
              key={cat}
              className={`btn btn-sm ${activeTab === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(cat)}
              style={{ padding: 'var(--space-3)', height: 'auto', flexDirection: 'column', gap: 'var(--space-1)' }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 'var(--text-xxs)', fontWeight: '700' }}>{CATEGORIES[cat].title}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-6)', minHeight: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', color: CATEGORIES[activeTab].color }}>{CATEGORIES[activeTab].title}</h3>
          <span style={{ fontSize: 'var(--text-xxs)', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px' }}>
            {items[activeTab].length} items
          </span>
        </div>
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-6)' }}>{CATEGORIES[activeTab].desc}</p>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder={`Add an item to ${CATEGORIES[activeTab].title}...`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button className="btn btn-secondary" onClick={addItem} disabled={!newItem.trim()}>
            <Plus size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <AnimatePresence>
            {items[activeTab].map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card"
                style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)' }}
              >
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{item.text}</span>
                <button onClick={() => removeItem(activeTab, item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {items[activeTab].length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--text-muted)' }}>
              <Info size={24} style={{ opacity: 0.2, marginBottom: 'var(--space-2)' }} />
              <p style={{ fontSize: 'var(--text-xs)' }}>Your {activeTab} section is empty.</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          <ArrowLeft size={16} /> Cancel
        </button>
        <button 
          className="btn btn-primary" 
          disabled={totalItems < 4}
          onClick={() => onComplete(items)}
        >
          Save Menu <CheckCircle2 size={18} />
        </button>
      </footer>
    </div>
  );
}
