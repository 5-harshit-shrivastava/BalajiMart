
import { getProducts } from "@/services/productService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { AddProductDialog } from "@/components/dashboard/AddProductDialog"
import { EditProductDialog } from "@/components/dashboard/EditProductDialog"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Package } from "lucide-react"

export default async function DashboardProductsPage() {
  const products: Product[] = await getProducts();
  
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Products</h1>
        </div>
      </header>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your product listings.</p>
          </div>
          <AddProductDialog />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>A list of all products in your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.length > 0 ? products.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col">
                  <div className="aspect-square w-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      data-ai-hint={product['data-ai-hint'] || "product image"}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold truncate text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{product.sku}</p>
                    <div className="mt-2">
                      {product.stock < product.lowStockThreshold ? (
                          <Badge variant="destructive">Low Stock ({product.stock})</Badge>
                      ) : product.stock > 0 ? (
                          <Badge variant="secondary">In Stock ({product.stock})</Badge>
                      ) : (
                          <Badge variant="outline">Out of Stock</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                      <span className="font-bold text-base md:text-lg text-primary">₹{product.price.toFixed(2)}</span>
                      <EditProductDialog product={product} />
                    </div>
                  </div>
                </Card>
              )) : (
                <p className="text-muted-foreground col-span-full text-center py-10">No products found. Click "Add New Product" to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
