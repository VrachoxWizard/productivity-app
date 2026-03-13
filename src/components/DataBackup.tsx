import React, { useRef } from 'react';
import { Download, Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import { saveData } from '../lib/storage';

const BACKUP_KEYS = ['tasks', 'journal_entries', 'therapy_logs', 'focus_sessions', 'custom_prompts'];

export default function DataBackup() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backup: Record<string, any> = {};
    BACKUP_KEYS.forEach(key => {
      const data = localStorage.getItem(`mindspace_${key}`);
      if (data) backup[key] = JSON.parse(data);
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation: must be an object and have at least one valid key
        if (typeof data !== 'object' || data === null) throw new Error('Invalid backup format');
        
        const importedKeys = Object.keys(data);
        const validKeysFound = importedKeys.filter(k => BACKUP_KEYS.includes(k));

        if (validKeysFound.length === 0) {
          alert('No valid MindSpace data found in this file.');
          return;
        }

        if (confirm(`Found ${validKeysFound.length} data modules. This will merge/overwrite your current data. Continue?`)) {
          validKeysFound.forEach(key => {
            saveData(key, data[key]);
          });
          
          // Trigger global update event
          window.dispatchEvent(new CustomEvent('mindspace-data-changed'));
          alert('Backup imported successfully!');
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to parse backup file. Please ensure it is a valid MindSpace JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="data-backup glass-card" style={{ padding: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
        <h4 style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Data Safety</h4>
      </div>
      
      <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
        Your data is stored locally. Export regularly to keep a backup or move between devices.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button className="btn btn-ghost btn-sm" onClick={handleExport} style={{ flex: 1, gap: '6px' }}>
          <Download size={14} />
          Export
        </button>
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={() => fileInputRef.current?.click()}
          style={{ flex: 1, gap: '6px' }}
        >
          <Upload size={14} />
          Import
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".json" 
        style={{ display: 'none' }} 
      />
    </div>
  );
}
