import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, increment, onSnapshot, query, where } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWX7YAv0aD3xqA417IZ6y-MtU8-DpIVRQ",
  authDomain: "aurora-awards-by-fj.firebaseapp.com",
  projectId: "aurora-awards-by-fj",
  storageBucket: "aurora-awards-by-fj.firebasestorage.app",
  messagingSenderId: "938893054490",
  appId: "1:938893054490:web:5653001eb1165e7c3d37a3",
  measurementId: "G-XTYN7STM6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Candidate type matching Firestore structure
export interface Candidate {
  id: string;
  name: string;
  image: string;
  type: string;
  votes: number;
}

// Fetch candidates by type
export const getCandidates = async (type: string): Promise<Candidate[]> => {
  try {
    const candidatesRef = collection(db, 'candidates');
    const q = query(candidatesRef, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Candidate));
  } catch (error) {
    console.error('Error getting candidates:', error);
    return [];
  }
};

// Cast vote for a candidate
export const castVote = async (candidateId: string): Promise<boolean> => {
  try {
    const candidateRef = doc(db, 'candidates', candidateId);
    await updateDoc(candidateRef, {
      votes: increment(1)
    });
    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    return false;
  }
};

// Subscribe to candidates by type for real-time updates
export const subscribeToCandidates = (
  type: string,
  callback: (candidates: Candidate[]) => void
): (() => void) => {
  const candidatesRef = collection(db, 'candidates');
  
  return onSnapshot(candidatesRef, (snapshot) => {
    const candidates = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Candidate))
      .filter(c => c.type === type);
    callback(candidates);
  });
};
