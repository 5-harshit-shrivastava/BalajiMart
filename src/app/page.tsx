
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getProducts } from '@/services/productService';
import { getClientOrders } from '@/services/orderService';
import { ProductCard } from '@/components/ProductCard';
import type { Product, Order } from '@/lib/types';
import { Loader2, Search, ShoppingCart, Package, Briefcase, ArrowRight } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CustomerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [latestOrder, setLatestOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [productList, orders] = await Promise.all([
          getProducts(),
          getClientOrders(user.uid)
        ]);
        setProducts(productList);
        if (orders.length > 0) {
          setLatestOrder(orders[0]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const getBuyAgainProducts = () => {
    if (!latestOrder) return [];
    const productIds = latestOrder.items.map(item => item.productId);
    return products.filter(p => productIds.includes(p.id)).slice(0, 5); // Show up to 5 items
  };

  const getRecommendedProducts = () => {
    // Simple recommendation: show top-selling items that are not in the last order
    const lastOrderProductIds = latestOrder ? latestOrder.items.map(item => item.productId) : [];
    return products
      .filter(p => !lastOrderProductIds.includes(p.id))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Show top 5 best-sellers
  };

  if (authLoading || !user || !user.infoComplete) {
     return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
     );
  }

  const dashboardCards = [
    { title: "Shop All Products", href: "/shop", icon: Package, description: "Browse our full catalog" },
    { title: "My Orders", href: "/orders", icon: Briefcase, description: "View your order history" },
    { title: "View Cart", href: "/cart", icon: ShoppingCart, description: "Proceed to checkout" },
  ]
  
  return (
    <SidebarProvider>
      <Sidebar>
        <CustomerNav />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
                 <SidebarTrigger />
                 <h1 className="text-lg font-semibold">Welcome, {user.name}</h1>
            </header>
            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight hidden md:block">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Here's your personal dashboard.</p>
                </div>
                
                {/* Quick Navigation */}
                <div className="grid gap-4 md:grid-cols-3">
                  {dashboardCards.map(card => (
                      <Link href={card.href} key={card.title} passHref>
                          <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-base font-medium">{card.title}</CardTitle>
                                  <card.icon className="h-5 w-5 text-muted-foreground" />
                              </CardHeader>
                              <CardContent className="flex-grow">
                                  <p className="text-xs text-muted-foreground">{card.description}</p>
                              </CardContent>
                          </Card>
                      </Link>
                  ))}
                </div>


                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                  <>
                    {/* Buy It Again Section */}
                    {latestOrder && getBuyAgainProducts().length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Buy It Again</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {getBuyAgainProducts().map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended for you Section */}
                    {getRecommendedProducts().length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Recommended For You</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {getRecommendedProducts().map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CustomerDashboardPage;
