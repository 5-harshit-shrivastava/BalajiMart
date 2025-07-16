
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, ShoppingCart, Package, LogOut } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"

const menuItems = [
  { href: "/", label: "Shop", icon: Package },
  { href: "/orders", label: "My Orders", icon: Briefcase },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
]

export function CustomerNav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { cartCount } = useCart()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-2">
         <Briefcase className="h-8 w-8 text-primary" />
         <div className="font-bold text-xl group-data-[collapsible=icon]:hidden">
            Balaji Mart
         </div>
      </div>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                <item.icon />
                <span>{item.label}</span>
                {item.href === '/cart' && cartCount > 0 && (
                    <SidebarMenuBadge>{cartCount}</SidebarMenuBadge>
                )}
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
