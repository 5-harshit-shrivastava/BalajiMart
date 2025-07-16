
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import type { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return productList;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<string> {
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, productData);
    
    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/shop');
    
    return docRef.id;
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, productData);

    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/shop');
}

export async function deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
        const productData = productDoc.data() as Product;
        // Delete image from storage only if it's a real Firebase Storage URL
        if (productData.image && productData.image.includes('firebasestorage.googleapis.com')) {
            try {
                const imageRef = ref(storage, productData.image);
                await deleteObject(imageRef);
            } catch (error: any) {
                // If file doesn't exist, we can ignore the error
                if (error.code !== 'storage/object-not-found') {
                    console.error("Error deleting image from storage:", error);
                }
            }
        }
    }

    await deleteDoc(productRef);
    
    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/shop');
}