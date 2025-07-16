"use client"

import { useCart } from "@/hooks/use-cart"
import { Header } from "@/components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { createOrder } from "@/services/orderService"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart()

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
        await createOrder({
            // These would come from a user session/form in a real app
            customerName: 'Alice Johnson', 
            customerPhone: '+91 98765 43210',
            customerAddress: '456 Oak Avenue, Mumbai, MH 400001',
            items: cartItems.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: cartTotal,
        });

        toast({
            title: "Order Placed!",
            description: "Your order has been successfully placed. Thank you for shopping!",
        })
        clearCart()
    } catch (error) {
        console.error("Failed to place order:", error);
        toast({
            title: "Order Failed",
            description: "There was a problem placing your order. Please try again.",
            variant: "destructive",
        })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
            <Card>
              <CardContent className="p-6">
                <ul className="divide-y divide-border">
                  {cartItems.map(item => (
                    <li key={item.product.id} className="flex items-center py-4 gap-4">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        data-ai-hint={item.product['data-ai-hint']}
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">₹{item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                          className="w-20 h-9"
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
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
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
              <CardFooter>
                 <Button className="w-full" onClick={handlePlaceOrder}>Place Order</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-20">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/" passHref>
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  )
}
