
import Link from "next/link"
import { getProducts } from "@/services/productService"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { SeedDataButton } from "@/components/dashboard/SeedDataButton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, BarChart2, ArrowRight, LayoutDashboard } from "lucide-react"
import type { Product } from "@/lib/types"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function DashboardPage() {
  const products: Product[] = await getProducts();

  const dashboardCards = [
    {
      title: "Track Orders",
      description: "View and manage all customer orders.",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Manage Inventory",
      description: "See stock levels and manage products.",
      href: "/dashboard/products",
      icon: Package,
    },
  ]

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </header>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight hidden md:block">Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, here's your business overview.</p>
          </div>
          <SeedDataButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {dashboardCards.map(card => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1.5">
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <card.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={card.href} passHref>
                  <Button variant="outline" size="sm">
                    Go to {card.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6" />
                  Customer Insights
              </CardTitle>
              <CardDescription>
                Here are your top-selling products based on units sold.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart products={products} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
