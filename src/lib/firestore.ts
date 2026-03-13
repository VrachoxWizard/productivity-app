import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const useFirestore = (userId: string) => {
  const userRef = doc(db, 'users', userId);

  const getCollectionRef = (name: string) => collection(userRef, name);

  const subscribeToCollection = <T,>(
    collectionName: string, 
    callback: (data: T[]) => void,
    orderField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ) => {
    const q = query(getCollectionRef(collectionName), orderBy(orderField, orderDirection));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      callback(data);
    });
  };

  const addDocument = async (collectionName: string, data: any) => {
    return await addDoc(getCollectionRef(collectionName), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const updateDocument = async (collectionName: string, id: string, data: any) => {
    const docRef = doc(getCollectionRef(collectionName), id);
    return await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  };

  const removeDocument = async (collectionName: string, id: string) => {
    const docRef = doc(getCollectionRef(collectionName), id);
    return await deleteDoc(docRef);
  };

  return {
    subscribeToCollection,
    addDocument,
    updateDocument,
    removeDocument
  };
};
