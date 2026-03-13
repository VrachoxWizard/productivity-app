import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth/AuthContext';
import { useFirestore } from '@/lib/firestore';

export function useMindSpaceData<T>(collectionName: string, fallback: T) {
  const { user } = useAuth();
  const [data, setData] = useState<T>(fallback);
  
  const { subscribeToCollection } = useFirestore(user?.uid || '');

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToCollection<any>(collectionName, (freshData) => {
      setData(freshData as unknown as T);
    });
    
    return () => unsubscribe();
  }, [user, collectionName]);

  return data;
}
