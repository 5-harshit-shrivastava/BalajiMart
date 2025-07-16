"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "../ui/button"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

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
             <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  )
}
