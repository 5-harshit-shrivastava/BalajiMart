
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STORE_INFO_COLLECTION = 'storeInfo';
const STORE_INFO_DOC_ID = 'main';

interface StoreInfo {
  address: string;
  phone: string;
}

const defaultStoreInfo: StoreInfo = {
  address: "Arjun Gali, Rangpur Rd, Railway Station Area, Kota, Rajasthan 324002 near mishra optician",
  phone: "9588203452",
};

/**
 * Fetches the store information from Firestore.
 * If it doesn't exist, it creates a default document.
 * @returns The store information object.
 */
export const getStoreInfo = async (): Promise<StoreInfo> => {
  try {
    const docRef = doc(db, STORE_INFO_COLLECTION, STORE_INFO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as StoreInfo;
    } else {
      // Document doesn't exist, so create it with default values
      await setDoc(docRef, defaultStoreInfo);
      return defaultStoreInfo;
    }
  } catch (error) {
    console.error("Error fetching or creating store info:", error);
    // Return default info as a fallback
    return defaultStoreInfo;
  }
};

/**
 * Updates the store information in Firestore.
 * @param data The partial data to update.
 */
export const updateStoreInfo = async (data: Partial<StoreInfo>) => {
  const docRef = doc(db, STORE_INFO_COLLECTION, STORE_INFO_DOC_ID);
  await updateDoc(docRef, data);
};
