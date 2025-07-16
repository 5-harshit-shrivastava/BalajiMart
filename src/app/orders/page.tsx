
"use client";

import React from "react"
import { useAuth } from "@/hooks/use-auth"
import { getClientOrders } from "@/services/orderService"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [clientOrders, setClientOrders] = React.useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        setOrdersLoading(true);
        try {
          const orders = await getClientOrders(user.uid);
          setClientOrders(orders);
        } catch (error) {
          console.error("Failed to fetch client orders", error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };
    if (user) {
        fetchOrders();
    }
  }, [user]);

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
    switch (status) {
      case 'Ordered Successfully':
      case 'Processing':
      case 'In Delivery':
      case 'Delivered':
        return 'default' // Green background
      default:
        return 'default'
    }
  }

  if (authLoading || !user || user.role !== 'customer') {
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
        <main className="min-h-screen">
           <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
                 <SidebarTrigger />
                 <h1 className="text-lg font-semibold">My Orders</h1>
            </header>
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="hidden md:block">
                <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                <p className="text-muted-foreground">A list of your past and current orders.</p>
              </div>
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Review your past and current orders below.</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : clientOrders.length > 0 ? (
                  <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                  <TableHead>Order ID</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Delivery Address</TableHead>
                                  <TableHead>Items</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {clientOrders.map((order) => (
                                  <TableRow key={order.id}>
                                      <TableCell className="font-medium">{order.id.substring(0, 7)}</TableCell>
                                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                      <TableCell>
                                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                      </TableCell>
                                      <TableCell>{order.customerAddress}</TableCell>
                                      <TableCell className="max-w-xs truncate">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                                      <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                                  </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-4">
                          {clientOrders.map((order) => (
                              <Card key={order.id} className="overflow-hidden">
                                  <CardHeader className="flex flex-row items-start justify-between p-4 bg-muted/50">
                                      <div>
                                          <p className="font-semibold">Order #{order.id.substring(0, 7)}</p>
                                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                      </div>
                                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                  </CardHeader>
                                  <CardContent className="p-4 space-y-3">
                                      <div className="text-sm">
                                          <p className="font-medium">Items</p>
                                          <p className="text-muted-foreground truncate">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
                                      </div>
                                      <div className="text-sm">
                                          <p className="font-medium">Delivery Address</p>
                                          <p className="text-muted-foreground">{order.customerAddress}</p>
                                      </div>
                                      <div className="flex justify-between items-center pt-3 border-t">
                                          <p className="font-semibold">Total</p>
                                          <p className="font-bold text-primary">₹{order.total.toFixed(2)}</p>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                  </>
                ) : (
                    <div className="text-center py-20">
                        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground">You haven't placed any orders with us.</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default OrdersPage;
