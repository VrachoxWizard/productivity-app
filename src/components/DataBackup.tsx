import React, { useRef } from 'react';
import { Download, Upload, ShieldCheck, Cloud } from 'lucide-react';
import { useAuth } from '../components/Auth/AuthContext';
import { useFirestore } from '../lib/firestore';

const BACKUP_KEYS = ['tasks', 'journal_entries', 'therapy_logs', 'focus_sessions', 'custom_prompts'];

export default function DataBackup() {
  const { user } = useAuth();
  const { addDocument } = useFirestore(user?.uid || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Collect from localStorage for legacy backup
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
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (typeof data !== 'object' || data === null) throw new Error('Invalid format');
        
        const importedKeys = Object.keys(data);
        const validKeysFound = importedKeys.filter(k => BACKUP_KEYS.includes(k));

        if (validKeysFound.length === 0) {
          alert('No valid MindSpace data found.');
          return;
        }

        if (confirm(`Found ${validKeysFound.length} data modules. Sync them to your Cloud account?`)) {
          for (const key of validKeysFound) {
            const items = Array.isArray(data[key]) ? data[key] : [];
            for (const item of items) {
              // Strip old IDs and IDs to let Firestore generate new ones or keep them?
              // Usually better to let Firestore generate new ones to avoid collisions if merging
              const { id, ...cleanItem } = item;
              await addDocument(key, cleanItem);
            }
          }
          alert('Data synced to cloud successfully!');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="data-backup glass-card" style={{ padding: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <Cloud size={18} style={{ color: 'var(--accent)' }} />
        <h4 style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Cloud & Security</h4>
      </div>
      
      <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
        Your data is now safely synced to the cloud. You can still import legacy local backups here.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button className="btn btn-ghost btn-sm" onClick={handleExport} style={{ flex: 1, gap: '6px' }}>
          <Download size={14} />
          Backup Local
        </button>
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={() => fileInputRef.current?.click()}
          style={{ flex: 1, gap: '6px' }}
        >
          <Upload size={14} />
          Sync Local
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
