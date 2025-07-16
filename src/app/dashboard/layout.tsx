
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardNav />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
