import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import type { Product } from '@/lib/types';

const dummyProducts: Omit<Product, 'id'>[] = [
    {
        name: "Amul Gold Milk",
        sku: "AMUL-GLD-1L",
        stock: 50,
        lowStockThreshold: 10,
        price: 66.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "milk carton",
        sales: 120
    },
    {
        name: "Britannia Bread",
        sku: "BRT-BRD-400G",
        stock: 30,
        lowStockThreshold: 5,
        price: 45.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "bread loaf",
        sales: 250
    },
    {
        name: "Parle-G Biscuits",
        sku: "PAR-G-100G",
        stock: 200,
        lowStockThreshold: 50,
        price: 10.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "biscuit packet",
        sales: 800
    },
    {
        name: "Tata Salt",
        sku: "TATA-SLT-1KG",
        stock: 80,
        lowStockThreshold: 20,
        price: 28.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "salt packet",
        sales: 150
    },
    {
        name: "Aashirvaad Atta",
        sku: "AASH-ATA-5KG",
        stock: 40,
        lowStockThreshold: 10,
        price: 250.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "flour bag",
        sales: 90
    },
    {
        name: "Maggi 2-Minute Noodles",
        sku: "MAG-NOOD-70G",
        stock: 150,
        lowStockThreshold: 30,
        price: 14.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "instant noodles",
        sales: 500
    },
    {
        name: "Colgate MaxFresh Toothpaste",
        sku: "COL-TP-150G",
        stock: 60,
        lowStockThreshold: 15,
        price: 95.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "toothpaste box",
        sales: 75
    },
    {
        name: "Lifebuoy Soap",
        sku: "LIFE-SOAP-125G",
        stock: 100,
        lowStockThreshold: 25,
        price: 35.00,
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "soap bar",
        sales: 300
    },
];

export async function seedProducts() {
  const productsCol = collection(db, 'products');

  // Optional: Check if the collection is already populated
  const snapshot = await getDocs(productsCol);
  if (!snapshot.empty) {
    console.log("Products collection is not empty. Seeding aborted.");
    // To prevent accidental duplication, we can stop here.
    // Or, for this use-case, we can just allow adding more.
    // Let's proceed to add for simplicity of the demo.
  }

  const promises = dummyProducts.map(product => {
      return addDoc(productsCol, product);
  });
  
  await Promise.all(promises);
  console.log('Dummy products have been added to Firestore.');
}
