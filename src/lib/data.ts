import type { Product, Order } from './types';

export const products: Product[] = [
  { id: '1', name: 'Organic Bananas', sku: 'FR-001', stock: 150, lowStockThreshold: 20, price: 150, image: 'https://placehold.co/600x400', sales: 250, 'data-ai-hint': 'organic bananas' },
  { id: '2', name: 'Artisan Sourdough', sku: 'BK-001', stock: 18, lowStockThreshold: 15, price: 450, image: 'https://placehold.co/600x400', sales: 180, 'data-ai-hint': 'artisan bread' },
  { id: '3', name: 'Free-Range Eggs', sku: 'DR-001', stock: 80, lowStockThreshold: 24, price: 120, image: 'https://placehold.co/600x400', sales: 320, 'data-ai-hint': 'eggs carton' },
  { id: '4', name: 'Whole Milk (1 Litre)', sku: 'DR-002', stock: 12, lowStockThreshold: 10, price: 70, image: 'https://placehold.co/600x400', sales: 210, 'data-ai-hint': 'milk carton' },
  { id: '5', name: 'Avocado Hass', sku: 'FR-002', stock: 60, lowStockThreshold: 15, price: 200, image: 'https://placehold.co/600x400', sales: 400, 'data-ai-hint': 'fresh avocado' },
  { id: '6', name: 'Gourmet Coffee Beans', sku: 'BV-001', stock: 45, lowStockThreshold: 10, price: 800, image: 'https://placehold.co/600x400', sales: 150, 'data-ai-hint': 'coffee beans' },
  { id: '7', name: 'Imported Olive Oil', sku: 'CN-001', stock: 8, lowStockThreshold: 5, price: 1800, image: 'https://placehold.co/600x400', sales: 90, 'data-ai-hint': 'olive oil' },
  { id: '8', name: 'Organic Spinach', sku: 'VG-001', stock: 30, lowStockThreshold: 10, price: 80, image: 'https://placehold.co/600x400', sales: 120, 'data-ai-hint': 'fresh spinach' },
];

export const orders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'Alice Johnson',
        customerPhone: '+91 98765 43210',
        customerAddress: '456 Oak Avenue, Mumbai, MH 400001',
        items: [
            { productId: '3', name: 'Free-Range Eggs', quantity: 2, price: 120 },
            { productId: '2', name: 'Artisan Sourdough', quantity: 1, price: 450 },
        ],
        status: 'Delivered',
        date: '2023-10-26',
        total: 690,
    },
    {
        id: 'ORD-002',
        customerName: 'Bob Williams',
        customerPhone: '+91 98765 43211',
        customerAddress: '789 Pine Street, New Delhi, DL 110001',
        items: [
            { productId: '5', name: 'Avocado Hass', quantity: 4, price: 200 },
        ],
        status: 'Complete',
        date: '2023-10-25',
        total: 800,
    },
    {
        id: 'ORD-003',
        customerName: 'Charlie Brown',
        customerPhone: '+91 98765 43212',
        customerAddress: '101 Maple Lane, Bengaluru, KA 560001',
        items: [
            { productId: '1', name: 'Organic Bananas', quantity: 1, price: 150 },
            { productId: '4', name: 'Whole Milk (1 Litre)', quantity: 1, price: 70 },
            { productId: '6', name: 'Gourmet Coffee Beans', quantity: 1, price: 800 },
        ],
        status: 'Ordered Successfully',
        date: '2023-10-27',
        total: 1020,
    },
    {
        id: 'ORD-004',
        customerName: 'Diana Prince',
        customerPhone: '+91 98765 43213',
        customerAddress: '212 Birch Road, Kolkata, WB 700001',
        items: [
            { productId: '7', name: 'Imported Olive Oil', quantity: 1, price: 1800 },
        ],
        status: 'Delivered',
        date: '2023-10-24',
        total: 1800
    }
];
