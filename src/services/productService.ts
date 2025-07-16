import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Product } from '@/lib/types';

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return productList;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<string> {
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, productData);
    return docRef.id;
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, productData);
}

export async function deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
}
