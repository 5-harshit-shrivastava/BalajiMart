import type { Product, Order } from './types';

export const products: Product[] = [
  { id: '1', name: 'Organic Bananas', sku: 'FR-001', stock: 150, lowStockThreshold: 20, price: 1.99, image: 'https://placehold.co/600x400', sales: 250, 'data-ai-hint': 'organic bananas' },
  { id: '2', name: 'Artisan Sourdough', sku: 'BK-001', stock: 18, lowStockThreshold: 15, price: 5.49, image: 'https://placehold.co/600x400', sales: 180, 'data-ai-hint': 'artisan bread' },
  { id: '3', name: 'Free-Range Eggs', sku: 'DR-001', stock: 80, lowStockThreshold: 24, price: 4.99, image: 'https://placehold.co/600x400', sales: 320, 'data-ai-hint': 'eggs carton' },
  { id: '4', name: 'Whole Milk (Gallon)', sku: 'DR-002', stock: 12, lowStockThreshold: 10, price: 3.99, image: 'https://placehold.co/600x400', sales: 210, 'data-ai-hint': 'milk gallon' },
  { id: '5', name: 'Avocado Hass', sku: 'FR-002', stock: 60, lowStockThreshold: 15, price: 2.50, image: 'https://placehold.co/600x400', sales: 400, 'data-ai-hint': 'fresh avocado' },
  { id: '6', name: 'Gourmet Coffee Beans', sku: 'BV-001', stock: 45, lowStockThreshold: 10, price: 15.99, image: 'https://placehold.co/600x400', sales: 150, 'data-ai-hint': 'coffee beans' },
  { id: '7', name: 'Imported Olive Oil', sku: 'CN-001', stock: 8, lowStockThreshold: 5, price: 22.00, image: 'https://placehold.co/600x400', sales: 90, 'data-ai-hint': 'olive oil' },
  { id: '8', name: 'Organic Spinach', sku: 'VG-001', stock: 30, lowStockThreshold: 10, price: 3.49, image: 'https://placehold.co/600x400', sales: 120, 'data-ai-hint': 'fresh spinach' },
];

export const orders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'Alice Johnson',
        items: [
            { productId: '3', name: 'Free-Range Eggs', quantity: 2, price: 4.99 },
            { productId: '2', name: 'Artisan Sourdough', quantity: 1, price: 5.49 },
        ],
        status: 'Delivered',
        date: '2023-10-26',
        total: 15.47,
    },
    {
        id: 'ORD-002',
        customerName: 'Bob Williams',
        items: [
            { productId: '5', name: 'Avocado Hass', quantity: 4, price: 2.50 },
        ],
        status: 'Complete',
        date: '2023-10-25',
        total: 10.00,
    },
    {
        id: 'ORD-003',
        customerName: 'Charlie Brown',
        items: [
            { productId: '1', name: 'Organic Bananas', quantity: 1, price: 1.99 },
            { productId: '4', name: 'Whole Milk (Gallon)', quantity: 1, price: 3.99 },
            { productId: '6', name: 'Gourmet Coffee Beans', quantity: 1, price: 15.99 },
        ],
        status: 'Ordered Successfully',
        date: '2023-10-27',
        total: 21.97,
    },
    {
        id: 'ORD-004',
        customerName: 'Diana Prince',
        items: [
            { productId: '7', name: 'Imported Olive Oil', quantity: 1, price: 22.00 },
        ],
        status: 'Delivered',
        date: '2023-10-24',
        total: 22.00
    }
];
