
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';

export interface TLoginCredentials {
  email: string;
  password?: string;
}

/**
 * Fetches user data from the 'users' collection in Firestore.
 * @param uid The user's unique ID.
 * @returns The user data object or null if not found.
 */
export const getUserData = async (uid: string): Promise<AppUser | null> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data() as AppUser;
  } else {
    console.warn(`No user document found for UID: ${uid}`);
    return null;
  }
};

/**
 * Updates customer-specific information in their user document.
 * @param uid The customer's unique ID.
 * @param data The partial data to update.
 */
export const updateCustomerInfo = async (uid: string, data: Partial<AppUser>) => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
};
