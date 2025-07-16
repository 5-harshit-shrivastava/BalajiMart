
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return productList;
}

async function uploadImage(imageFile: File, sku: string): Promise<string> {
    if (!imageFile) return "https://placehold.co/600x400.png";
    const storageRef = ref(storage, `products/${sku}-${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function addProduct(productData: Omit<Product, 'id' | 'image'>, imageFile: File | null): Promise<string> {
    const imageUrl = imageFile ? await uploadImage(imageFile, productData.sku) : "https://placehold.co/600x400.png";
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, { ...productData, image: imageUrl });
    
    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/shop');
    
    return docRef.id;
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'image'>>, imageFile: File | null): Promise<void> {
    const productRef = doc(db, 'products', id);
    const updateData: Partial<Product> = { ...productData };

    if (imageFile) {
        // To be safe, let's delete the old image if it exists
        const oldDocSnap = await getDoc(productRef);
        if (oldDocSnap.exists()) {
            const oldProductData = oldDocSnap.data() as Product;
            if (oldProductData.image && oldProductData.image.includes('firebasestorage.googleapis.com')) {
                 try {
                    const oldImageRef = ref(storage, oldProductData.image);
                    await deleteObject(oldImageRef);
                } catch (error: any) {
                    if (error.code !== 'storage/object-not-found') {
                        console.error("Could not delete old image, continuing update.", error);
                    }
                }
            }
        }
        updateData.image = await uploadImage(imageFile, productData.sku || `product-${id}`);
    }
    
    await updateDoc(productRef, updateData);

    revalidatePath('/dashboard/products');
    revalidatePath('/');
    revalidatePath('/shop');
}

export async function deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
        const productData = productDoc.data() as Product;
        // Delete image from storage if it's a firebase storage URL
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
