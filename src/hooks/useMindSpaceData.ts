import { useState, useEffect, useCallback } from 'react';
import { loadData } from '../lib/storage';

export function useMindSpaceData<T>(key: string, fallback: T) {
  const [data, setData] = useState<T>(() => loadData<T>(key, fallback));

  const refresh = useCallback(() => {
    setData(loadData<T>(key, fallback));
  }, [key, fallback]);

  useEffect(() => {
    const handleDataChange = (e: any) => {
      // If the event specifies a key, only refresh if it matches
      if (e.detail?.key && e.detail.key !== key) return;
      refresh();
    };

    window.addEventListener('mindspace-data-changed', handleDataChange);
    
    // Also listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `mindspace_${key}`) {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('mindspace-data-changed', handleDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, refresh]);

  return data;
}
