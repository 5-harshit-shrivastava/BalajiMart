
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, MapPin, Store, Loader2 } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';
import { useAuth } from "@/hooks/use-auth";
import { getStoreInfo } from '@/services/storeInfoService';

interface StoreInfo {
  address: string;
  phone: string;
}

export default function CustomerStoreInfoPage() {
  const { user, loading: authLoading } = useAuth();
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      setInfoLoading(true);
      const info = await getStoreInfo();
      setStoreInfo(info);
      setInfoLoading(false);
    }
    fetchInfo();
  }, []);

  if (authLoading || !user) {
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
                 <h1 className="text-lg font-semibold">Store Info</h1>
            </header>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-4">
                 <Store className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Store Information</h1>
                    <p className="text-muted-foreground">Our physical store location and contact details.</p>
                </div>
              </div>
              <Card className="w-full max-w-xl">
                <CardHeader>
                  <CardTitle>Balaji Mart</CardTitle>
                  <CardDescription>Your friendly neighborhood store.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {infoLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : storeInfo ? (
                    <>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold">Address</h3>
                          <p className="text-muted-foreground">{storeInfo.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold">Phone Number</h3>
                          <p className="text-muted-foreground">{storeInfo.phone}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Store information is not available at the moment.</p>
                  )}
                </CardContent>
              </Card>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
