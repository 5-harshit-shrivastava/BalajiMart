import { getProducts } from "@/services/productService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { AddProductDialog } from "@/components/dashboard/AddProductDialog"

export default async function DashboardProductsPage() {
  const products: Product[] = await getProducts();
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-40 object-cover"
                  data-ai-hint={product['data-ai-hint'] || "product image"}
                />
                <div className="p-4">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg text-primary">₹{product.price.toFixed(2)}</span>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
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
  )
}
