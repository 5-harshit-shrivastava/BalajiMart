import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import type { Order, OrderItem } from '@/lib/types';

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('date', 'desc'));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      date: data.date.toDate().toISOString().split('T')[0] // Convert timestamp to YYYY-MM-DD string
    } as Order
  });
  return orderList;
}

// Mocking one client for now
export async function getClientOrders(customerName: string): Promise<Order[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where("customerName", "==", customerName), orderBy('date', 'desc'));
    const orderSnapshot = await getDocs(q);
    const orderList = orderSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date.toDate().toISOString().split('T')[0],
        } as Order;
    });
    return orderList;
}

interface CreateOrderInput {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
}

export async function createOrder(order: CreateOrderInput): Promise<string> {
  const ordersCol = collection(db, 'orders');
  const newOrderRef = await addDoc(ordersCol, {
    ...order,
    status: 'Ordered Successfully',
    date: serverTimestamp(),
    id: '' // This will be overwritten by firestore, but needed for type
  });
  return newOrderRef.id;
}
