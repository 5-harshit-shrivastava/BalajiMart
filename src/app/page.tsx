
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/services/productService';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function ShopPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setProductsLoading(false);
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // AuthProvider handles redirection, so we can return null or a loader.
  if (!user || user.role !== 'customer' || !user.infoComplete) {
     return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
     );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container max-w-screen-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Welcome to Balaji Mart</h1>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="bg-muted aspect-video rounded-lg animate-pulse" />
                        <div className="space-y-2">
                           <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                           <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Balaji MartMan. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default ShopPage;
