"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutDashboard, Package, ShoppingCart } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-2">
         <Briefcase className="h-8 w-8 text-primary" />
         <div className="font-bold text-xl group-data-[collapsible=icon]:hidden">
            Balaji MartMan
         </div>
      </div>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="p-2 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
               <SidebarMenuButton tooltip="Client View">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>
                <span>Switch to Client View</span>
               </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  )
}
