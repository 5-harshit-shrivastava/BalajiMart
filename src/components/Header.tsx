"use client"

import Link from "next/link"
import { ShoppingCart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Briefcase } from "lucide-react"

export function Header() {
  const { cartItems, cartTotal, cartCount } = useCart()
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold">Balaji MartMan</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              My Orders
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Shopping Cart</h4>
                  <p className="text-sm text-muted-foreground">
                    Your selected items.
                  </p>
                </div>
                <Separator />
                <div className="grid gap-2">
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <div key={item.product.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
                        <span className="truncate">{item.product.name}</span>
                        <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                        <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <Link href="/cart" passHref>
                      <Button className="w-full">Go to Cart</Button>
                    </Link>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
