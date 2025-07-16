
"use client"

import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/services/orderService"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, RefreshCw, ShoppingCart, User, Phone, MapPin, Package } from "lucide-react"
import type { Order } from "@/lib/types"
import { toast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast({
        title: "Error",
        description: "Could not fetch orders. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast({
        title: "Success",
        description: `Order ${orderId.substring(0, 7)} marked as ${status}.`,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
    switch (status) {
      case 'Ordered Successfully':
      case 'Processing':
      case 'In Delivery':
      case 'Delivered':
        return 'default'
      default:
        return 'default'
    }
  };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Orders</h1>
        </div>
      </header>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">View and manage all customer orders.</p>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Card>
          <CardHeader className="hidden md:block">
            <CardTitle>All Orders</CardTitle>
            <CardDescription>A complete list of all orders placed through your store.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">No orders found.</div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id.substring(0, 7)}</TableCell>
                            <TableCell>
                            <div>{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            </TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{order.customerAddress}</TableCell>
                            <TableCell className="max-w-xs truncate">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleStatusChange(order.id, 'Processing'); }}>
                                    Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleStatusChange(order.id, 'In Delivery'); }}>
                                    Mark as In Delivery
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleStatusChange(order.id, 'Delivered'); }}>
                                    Mark as Delivered
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden -m-6 sm:-m-6">
                    <div className="space-y-4 p-4 sm:p-6">
                         <h1 className="text-2xl font-bold">All Orders</h1>
                         {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-start justify-between p-4 bg-muted/50">
                                    <div>
                                        <p className="font-semibold">Order #{order.id.substring(0, 7)}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                     <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{order.customerName}</span>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{order.customerPhone}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">{order.customerAddress}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total</p>
                                            <p className="font-bold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'Processing')}>Mark as Processing</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'In Delivery')}>Mark as In Delivery</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'Delivered')}>Mark as Delivered</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
