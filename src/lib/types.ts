
export type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  image: string;
  sales: number;
  'data-ai-hint'?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'Ordered Successfully' | 'Delivered' | 'Complete';
  date: string;
};

export type AppUser = {
    uid: string;
    email: string | null;
    role: 'owner' | 'customer';
    name: string;
    infoComplete: boolean;
    isFromKota?: boolean;
    address?: string;
    phone?: string;
}
