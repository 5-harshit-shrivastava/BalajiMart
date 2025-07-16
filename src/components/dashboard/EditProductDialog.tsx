"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { updateProduct, deleteProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters." }),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  lowStockThreshold: z.coerce.number().int().min(0, { message: "Threshold cannot be negative." }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  image: z.string().url({ message: "Please enter a valid image URL." }).min(1, { message: "Image URL is required." }),
});

interface EditProductDialogProps {
    product: Product;
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      price: product.price,
      image: product.image,
    },
  });

  const imagePreview = form.watch("image");

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        price: product.price,
        image: product.image,
      });
    }
  }, [open, product, form]);

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);
    try {
      const hint = values.name.split(' ').slice(0, 2).join(' ').toLowerCase();

      await updateProduct(product.id, {
        ...values,
        'data-ai-hint': hint,
      });

      toast({
        title: "Success!",
        description: "The product has been updated.",
      });
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description: "Could not update the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      await deleteProduct(product.id);
      toast({
        title: "Product Deleted",
        description: `"${product.name}" has been removed from your inventory.`,
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
       console.error("Failed to delete product:", error);
       toast({
        title: "Error",
        description: "Could not delete the product. Please try again.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
              <Edit className="mr-2 h-3 w-3" />
              Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for "{product.name}".
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
               <div className="flex items-center gap-4">
                 <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted flex-shrink-0">
                  {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" width={96} height={96} className="object-cover rounded-md" onError={(e) => e.currentTarget.src = "https://placehold.co/600x400.png"}/>
                  ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                  </div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Product Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                          <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Low Stock Threshold</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />

              <DialogFooter className="pt-4 flex justify-between w-full">
                <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={loading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
                <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                "{product.name}" from your inventory.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Yes, delete product
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}