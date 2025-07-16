
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { sendEmailVerification, createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * Fetches user data from the 'users' collection in Firestore.
 * If the document doesn't exist, it creates one for a new customer.
 * @param uid The user's unique ID.
 * @param email The user's email.
 * @param displayName The user's display name, if available.
 * @returns The user data object.
 */
export const getUserData = async (uid: string, email?: string | null, displayName?: string | null): Promise<AppUser | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as AppUser;
    } else {
      // This case is mostly for social auth providers or if creation fails in signUp
      // For email/password, the document is created in `createCustomerUser`.
      console.log(`Creating new user document for UID: ${uid}`);
      return await createCustomerUser(uid, email || '', displayName || email?.split('@')[0] || 'New User');
    }
  } catch (error) {
    console.error("Error fetching or creating user data:", error);
    return null;
  }
};


/**
 * Creates a new user document in Firestore with the 'customer' role.
 * @param uid The user's unique ID.
 * @param email The user's email.
 * @param name The user's full name.
 * @returns The newly created user data object.
 */
export const createCustomerUser = async (uid: string, email: string, name: string): Promise<AppUser> => {
    const userDocRef = doc(db, 'users', uid);
    const newUser: AppUser = {
      uid,
      email,
      role: 'customer',
      name,
      infoComplete: false,
    };
    await setDoc(userDocRef, newUser);
    return newUser;
};

export const signUpAndVerify = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send verification email
    await sendEmailVerification(user);

    // Create user document in Firestore
    await createCustomerUser(user.uid, email, name);
    
    return user;
}


/**
 * Updates customer-specific information in their user document.
 * This function specifically excludes role changes from the client.
 * @param uid The customer's unique ID.
 * @param data The partial data to update (e.g., name, address, phone).
 */
export const updateCustomerInfo = async (uid: string, data: Partial<Omit<AppUser, 'uid' | 'email' | 'role'>>) => {
    const userDocRef = doc(db, 'users', uid);
    // Explicitly copy only the allowed fields to prevent role escalation from client.
    const updateData: Partial<AppUser> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.isFromKota !== undefined) updateData.isFromKota = data.isFromKota;
    if (data.infoComplete !== undefined) updateData.infoComplete = data.infoComplete;
    
    await updateDoc(userDocRef, updateData);
};
