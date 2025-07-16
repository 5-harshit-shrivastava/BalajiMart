import { Header } from "@/components/Header"
import { getClientOrders } from "@/services/orderService"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package } from "lucide-react"
import type { Order } from "@/lib/types"
import withAuth from "@/hoc/withAuth"
import { useAuth } from "@/hooks/use-auth"
import React from "react"

function OrdersPage() {
  const { user } = useAuth();
  const [clientOrders, setClientOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        try {
          const orders = await getClientOrders(user.uid);
          setClientOrders(orders);
        } catch (error) {
          console.error("Failed to fetch client orders", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ordered Successfully': return 'secondary'
      case 'Delivered': return 'default'
      case 'Complete': return 'outline'
      default: return 'secondary'
    }
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
            {loading ? (
              <p>Loading orders...</p>
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

export default withAuth(OrdersPage, ['customer']);
