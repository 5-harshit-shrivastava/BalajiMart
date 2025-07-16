
"use client"

import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            data-ai-hint={product['data-ai-hint']}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-sm font-semibold truncate">{product.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-wrap justify-between items-center gap-2">
        <p className="text-base font-bold text-primary whitespace-nowrap">₹{product.price.toFixed(2)}</p>
        <Button onClick={handleAddToCart} disabled={product.stock === 0} size="sm" className="w-full sm:w-auto flex-grow sm:flex-grow-0">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
