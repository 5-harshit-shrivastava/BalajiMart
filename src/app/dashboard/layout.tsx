
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Loader2 } from "lucide-react";
import React from "react";

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user || user.role !== 'owner') {
    // This should be handled by the AuthProvider, but as a safeguard:
    if (typeof window !== 'undefined') {
       router.replace('/login');
    }
    return null; // Render nothing while redirecting
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardNav />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout;
