
"use client";

import React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { getClientOrders } from "@/services/orderService"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Ordered Successfully': return 'secondary'
      case 'Processing': return 'default'
      case 'In Delivery': return 'outline'
      case 'Delivered': return 'default'
      default: return 'secondary'
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Orders</h1>
        <Card>
          <CardHeader>
             <CardTitle>Your Order History</CardTitle>
             <CardDescription>A list of your past and current orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : clientOrders.length > 0 ? (
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
                       <TableCell>{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                      <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center py-20">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground">You haven't placed any orders with us.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default OrdersPage;
