
"use client"

import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { createOrder } from "@/services/orderService"
import { useState } from "react"
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';


function CartPage() {
  const { user, loading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart()
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !user) return;

    setIsPlacingOrder(true);
    try {
        const orderId = await createOrder(cartItems, cartTotal);

        if (orderId) {
            toast({
                title: "Order Placed!",
                description: "Your order has been successfully placed. Thank you for shopping!",
            })
            clearCart()
        }
    } catch (error) {
        console.error("Failed to place order:", error);
        toast({
            title: "Order Failed",
            description: "There was a problem placing your order. Please try again.",
            variant: "destructive",
        })
    } finally {
        setIsPlacingOrder(false);
    }
  }

  if (loading || !user || user.role !== 'customer') {
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
                 <h1 className="text-lg font-semibold">Your Cart</h1>
            </header>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                        <p className="text-muted-foreground">Review your items and proceed to checkout.</p>
                    </div>
                </div>
                {cartItems.length > 0 ? (
                  <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <ul className="divide-y divide-border">
                          {cartItems.map(item => (
                            <li key={item.product.id} className="flex items-center py-4 gap-4">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover aspect-square"
                                data-ai-hint={item.product['data-ai-hint']}
                              />
                              <div className="flex-grow">
                                <h3 className="font-semibold text-sm sm:text-base">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">₹{item.product.price.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                                  className="w-16 h-9"
                                />
                                 <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                              <p className="font-semibold w-24 text-right">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="sticky top-24">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 grid gap-4">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 sm:p-6">
                         <Button className="w-full" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                            {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Place Order
                         </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ) : (
                  <Card className="text-center py-20">
                    <CardContent className="p-4 sm:p-6">
                        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/" passHref>
                        <Button>Start Shopping</Button>
                        </Link>
                    </CardContent>
                  </Card>
                )}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CartPage;
