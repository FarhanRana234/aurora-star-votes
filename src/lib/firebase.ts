import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

// Firebase configuration - these are publishable keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.projectId;
};

// Initialize Firebase only if configured
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };

// Vote types
export interface Candidate {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface VoteData {
  [candidateId: string]: number;
}

// Firestore operations
export const getVotes = async (category: string): Promise<VoteData> => {
  if (!db) return {};
  
  try {
    const docRef = doc(db, 'votes', category);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as VoteData;
    }
    return {};
  } catch (error) {
    console.error('Error getting votes:', error);
    return {};
  }
};

export const castVote = async (category: string, candidateId: string): Promise<boolean> => {
  if (!db) return false;
  
  try {
    const docRef = doc(db, 'votes', category);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        [candidateId]: increment(1)
      });
    } else {
      await setDoc(docRef, {
        [candidateId]: 1
      });
    }
    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    return false;
  }
};

export const subscribeToVotes = (
  category: string, 
  callback: (votes: VoteData) => void
): (() => void) => {
  if (!db) {
    callback({});
    return () => {};
  }
  
  const docRef = doc(db, 'votes', category);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as VoteData);
    } else {
      callback({});
    }
  });
};
