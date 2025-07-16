import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';

/**
 * Fetches user data from the 'users' collection in Firestore.
 * If the document doesn't exist, it creates one for a new customer.
 * @param uid The user's unique ID.
 * @param email The user's email.
 * @returns The user data object.
 */
export const getUserData = async (uid: string, email?: string | null): Promise<AppUser | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as AppUser;
    } else {
      // If no document, this is a first-time login for this user.
      // Create a new customer document for them.
      console.log(`Creating new user document for UID: ${uid}`);
      const newUser: AppUser = {
        uid,
        email: email || null,
        role: 'customer', // Default role
        name: email?.split('@')[0] || 'New User',
        infoComplete: false,
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error fetching or creating user data:", error);
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