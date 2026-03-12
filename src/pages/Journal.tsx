import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  PenLine, 
  X, 
  Calendar, 
  Hash, 
  Plus, 
  ChevronRight, 
  BookOpen, 
  Search,
  Trash2,
  Filter
} from 'lucide-react';
import { loadData, saveData, generateId } from '../lib/storage';
import { systemPrompts, getPromptOfTheDay } from '../lib/prompts';
import type { JournalEntry, MoodLevel, Prompt } from '../types';
import './Journal.css';

const moodLabels: Record<MoodLevel, string> = {
  1: 'Struggling',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Great',
};

type JournalView = 'recent' | 'writing' | 'browsing' | 'managing';

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [customPrompts, setCustomPrompts] = useState<Prompt[]>([]);
  const [view, setView] = useState<JournalView>('recent');
  
  // Editor State
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodLevel>(3);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  
  // Browsing State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Managing State
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState('custom');

  const promptOfTheDay = getPromptOfTheDay();

  useEffect(() => {
    setEntries(loadData<JournalEntry[]>('journal_entries', []));
    setCustomPrompts(loadData<Prompt[]>('custom_prompts', []));
  }, []);

  const persistEntries = useCallback((updated: JournalEntry[]) => {
    setEntries(updated);
    saveData('journal_entries', updated);
  }, []);

  const persistCustomPrompts = useCallback((updated: Prompt[]) => {
    setCustomPrompts(updated);
    saveData('custom_prompts', updated);
  }, []);

  const saveEntry = () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: generateId(),
      content: content.trim(),
      promptUsed: activePrompt || undefined,
      mood,
      createdAt: new Date().toISOString(),
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
    };
    persistEntries([entry, ...entries]);
    resetEditor();
    setView('recent');
  };

  const resetEditor = () => {
    setContent('');
    setMood(3);
    setActivePrompt(null);
  };

  const deleteEntry = (id: string) => {
    persistEntries(entries.filter(e => e.id !== id));
  };

  const startWithPrompt = (text: string) => {
    setActivePrompt(text);
    setView('writing');
  };

  const addCustomPrompt = () => {
    if (!newPromptText.trim()) return;
    const prompt: Prompt = {
      id: generateId(),
      text: newPromptText.trim(),
      category: newPromptCategory,
      isCustom: true,
    };
    persistCustomPrompts([prompt, ...customPrompts]);
    setNewPromptText('');
  };

  const deleteCustomPrompt = (id: string) => {
    persistCustomPrompts(customPrompts.filter(p => p.id !== id));
  };

  const allPrompts = useMemo(() => [...systemPrompts, ...customPrompts], [customPrompts]);
  
  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(p => {
      const matchesSearch = p.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPrompts, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(allPrompts.map(p => p.category as string));
    return ['all', ...Array.from(cats)].sort();
  }, [allPrompts]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="journal-page">
      <div className="journal-page__header">
        <div>
          <h1>Journal</h1>
          <p>A safe space for your thoughts.</p>
        </div>
        <div className="journal-page__nav">
          <button 
            className={`btn btn-sm ${view === 'recent' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setView('recent')}
          >
            Recent
          </button>
          <button 
            className={`btn btn-sm ${view === 'browsing' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setView('browsing')}
          >
            Browse Prompts
          </button>
          <button 
            className={`btn btn-sm ${view === 'managing' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setView('managing')}
          >
            Custom Prompts
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'recent' && (
          <motion.div 
            key="recent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="journal-page__content"
          >
            {/* Prompt of the Day Quick Entry */}
            <div className="prompt-card glass-card">
              <div className="prompt-card__header">
                <Sparkles size={18} />
                <span>Prompt of the Day</span>
              </div>
              <p className="prompt-card__text">{promptOfTheDay.text}</p>
              <div className="prompt-card__actions">
                <button className="btn btn-primary btn-sm" onClick={() => startWithPrompt(promptOfTheDay.text)}>
                  Use this prompt
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setView('writing')}>
                  <PenLine size={14} /> Write freely
                </button>
              </div>
            </div>

            <div className="journal-page__entries">
              <h3 className="journal-page__section-title">
                Recent Entries
                {entries.length > 0 && <span className="journal-page__count">{entries.length}</span>}
              </h3>
              {entries.length === 0 ? (
                <div className="journal-page__empty">
                  <p>No entries yet. Start writing to see your thoughts here.</p>
                </div>
              ) : (
                <div className="entries-list">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="entry-card glass-card"
                      layout
                    >
                      <div className="entry-card__header">
                        <div className="entry-card__meta">
                          <Calendar size={14} />
                          <span>{formatDate(entry.createdAt)}</span>
                          <span className="mood-dot mood-dot--sm" style={{ background: `var(--mood-${entry.mood})` }} />
                          <span className="entry-card__mood-label">{moodLabels[entry.mood]}</span>
                        </div>
                        <button
                          className="btn btn-icon btn-ghost btn-sm entry-card__delete"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {entry.promptUsed && (
                        <p className="entry-card__prompt"><Sparkles size={12} /> {entry.promptUsed}</p>
                      )}
                      <p className="entry-card__text">{entry.content}</p>
                      <span className="entry-card__wc">{entry.wordCount} words</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="journal-editor glass-card"
          >
            <div className="journal-editor__header">
              <h3>New Entry</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => { resetEditor(); setView('recent'); }}>
                <X size={20} />
              </button>
            </div>

            {activePrompt && (
              <div className="journal-editor__prompt">
                <Sparkles size={14} />
                <em>{activePrompt}</em>
              </div>
            )}

            <textarea
              className="input journal-editor__textarea"
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />

            <div className="journal-editor__meta">
              <div className="journal-editor__mood">
                <span className="label" style={{ marginBottom: 0 }}>Mood:</span>
                <div className="mood-selector">
                  {([1, 2, 3, 4, 5] as MoodLevel[]).map((m) => (
                    <button
                      key={m}
                      className={`mood-dot ${mood === m ? 'mood-dot--active' : ''}`}
                      style={{ background: `var(--mood-${m})` }}
                      onClick={() => setMood(m)}
                      title={moodLabels[m]}
                    />
                  ))}
                </div>
              </div>
              <span className="journal-editor__wc">
                <Hash size={12} /> {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="journal-editor__actions">
              <button className="btn btn-primary" onClick={saveEntry} disabled={!content.trim()}>
                Save Entry
              </button>
              <button className="btn btn-ghost" onClick={() => { resetEditor(); setView('recent'); }}>
                Discard
              </button>
            </div>
          </motion.div>
        )}

        {view === 'browsing' && (
          <motion.div
            key="browsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="browse-prompts"
          >
            <div className="browse-prompts__filters">
              <div className="search-bar glass-card">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search prompts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="category-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-tab ${selectedCategory === cat ? 'cat-tab--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="prompts-grid">
              {filteredPrompts.map(p => (
                <div key={p.id} className="prompt-item glass-card" onClick={() => startWithPrompt(p.text)}>
                  <span className="prompt-item__category">{p.category}</span>
                  <p className="prompt-item__text">{p.text}</p>
                  <ChevronRight size={16} className="prompt-item__arrow" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'managing' && (
          <motion.div
            key="managing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="manage-prompts"
          >
            <div className="add-prompt glass-card">
              <h3>Create Custom Prompt</h3>
              <div className="add-prompt__form">
                <textarea 
                  className="input" 
                  placeholder="What is the prompt question?"
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                />
                <div className="add-prompt__footer">
                  <select 
                    className="input"
                    value={newPromptCategory}
                    onChange={(e) => setNewPromptCategory(e.target.value)}
                  >
                    <option value="custom">Custom</option>
                    <option value="reflection">Reflection</option>
                    <option value="growth">Growth</option>
                    <option value="gratitude">Gratitude</option>
                    <option value="self-care">Self-Care</option>
                  </select>
                  <button className="btn btn-primary" onClick={addCustomPrompt} disabled={!newPromptText.trim()}>
                    <Plus size={18} /> Add Prompt
                  </button>
                </div>
              </div>
            </div>

            <div className="custom-prompts-list">
              <h3>Your Custom Prompts</h3>
              {customPrompts.length === 0 ? (
                <p className="empty-msg">You haven't created any custom prompts yet.</p>
              ) : (
                <div className="prompts-list">
                  {customPrompts.map(p => (
                    <div key={p.id} className="prompt-item glass-card">
                      <div className="prompt-item__content">
                        <span className="prompt-item__category">{p.category}</span>
                        <p>{p.text}</p>
                      </div>
                      <button className="btn btn-icon btn-ghost btn-danger" onClick={() => deleteCustomPrompt(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
