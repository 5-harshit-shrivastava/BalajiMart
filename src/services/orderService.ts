import { db, auth } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, where, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { Order, OrderItem, AppUser } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('date', 'desc'));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      date: data.date.toDate().toISOString().split('T')[0] 
    } as Order
  });
  return orderList;
}

export async function getClientOrders(userId: string): Promise<Order[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where("userId", "==", userId), orderBy('date', 'desc'));
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


export async function createOrder(items: {product: any, quantity: number}[], total: number): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast({ title: "Error", description: "You must be logged in to place an order.", variant: "destructive"});
        return null;
    }
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User not found for order");
    }

    const userData = userSnap.data() as AppUser;

    const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
    }));

    const ordersCol = collection(db, 'orders');
    const newOrderRef = await addDoc(ordersCol, {
        userId: currentUser.uid,
        customerName: userData.name,
        customerPhone: userData.phone,
        customerAddress: userData.address,
        items: orderItems,
        total: total,
        status: 'Ordered Successfully',
        date: serverTimestamp()
    });
    return newOrderRef.id;
}


export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
};
