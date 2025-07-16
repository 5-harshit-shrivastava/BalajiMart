
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getProducts } from '@/services/productService';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';
import { Input } from '@/components/ui/input';

function ShopPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getProducts();
        setProducts(productList);
        setFilteredProducts(productList);
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

  React.useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().startsWith(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user || user.role !== 'customer' || !user.infoComplete) {
     return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
     );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <CustomerNav />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Balaji Mart</h1>
                    <p className="text-muted-foreground">Browse our products below or use the search bar.</p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="bg-muted aspect-square rounded-lg animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
            ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ShopPage;
