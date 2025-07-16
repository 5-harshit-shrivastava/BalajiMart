
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, MapPin, Store } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { CustomerNav } from '@/components/CustomerNav';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function CustomerStoreInfoPage() {
  const { user, loading } = useAuth();
  const storeAddress = "Arjun Gali, Rangpur Rd, Railway Station Area, Kota, Rajasthan 324002 near mishra optician";
  const storePhone = "9588203452";

  if (loading || !user) {
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
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4">
             <Store className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Store Information</h1>
                <p className="text-muted-foreground">Our physical store location and contact details.</p>
            </div>
          </div>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Balaji Mart</CardTitle>
              <CardDescription>Your friendly neighborhood store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-muted-foreground">{storeAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Phone Number</h3>
                  <p className="text-muted-foreground">{storePhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
