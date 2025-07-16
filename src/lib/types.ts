export type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  image: string;
  sales: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  status: 'In Cart' | 'Ordered Successfully' | 'Delivered' | 'Complete';
  date: string;
  total: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
