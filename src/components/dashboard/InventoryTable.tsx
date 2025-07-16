"use client"

import type { Product } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

interface InventoryTableProps {
  products: Product[]
}

export function InventoryTable({ products }: InventoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Live view of all products and their stock levels.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className={product.stock < product.lowStockThreshold ? "bg-destructive/10" : ""}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={product['data-ai-hint']}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.stock < product.lowStockThreshold ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : product.stock > 0 ? (
                    <Badge variant="secondary">In Stock</Badge>
                  ) : (
                    <Badge variant="outline">Out of Stock</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
