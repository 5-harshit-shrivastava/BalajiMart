
"use client"

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Edit, Loader2, Store } from "lucide-react";
import { getStoreInfo, updateStoreInfo } from "@/services/storeInfoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";

const storeInfoSchema = z.object({
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

export default function StoreInfoPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof storeInfoSchema>>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: {
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function fetchStoreInfo() {
      setIsLoading(true);
      try {
        const info = await getStoreInfo();
        if (info) {
          form.reset(info);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch store information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStoreInfo();
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof storeInfoSchema>) => {
    try {
      await updateStoreInfo(values);
      toast({
        title: "Success",
        description: "Store information has been updated.",
      });
      setIsEditing(false);
      router.refresh(); // This will re-trigger the fetch on the customer page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update store information.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Store Info</h1>
        </div>
      </header>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="hidden md:block">
              <h1 className="text-3xl font-bold tracking-tight">Store Information</h1>
              <p className="text-muted-foreground">Manage your store's contact and location details.</p>
          </div>
          {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
              </Button>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Balaji Mart</CardTitle>
            <CardDescription>Your store's contact and location details.</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && (
                      <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={form.formState.isSubmitting}>
                              Cancel
                          </Button>
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save Changes
                          </Button>
                      </div>
                    )}
                  </form>
              </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
