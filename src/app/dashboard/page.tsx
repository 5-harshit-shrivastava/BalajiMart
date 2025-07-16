import { products } from "@/lib/data"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { InventoryTable } from "@/components/dashboard/InventoryTable"
import { ReorderSuggestions } from "@/components/dashboard/ReorderSuggestions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockItems = products.filter(p => p.stock < p.lowStockThreshold).length
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)

  const stats = [
    { title: "Total Inventory Value", value: `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign, color: "text-green-500" },
    { title: "Total Units", value: totalStock, icon: Package, color: "text-blue-500" },
    { title: "Low Stock Alerts", value: lowStockItems, icon: AlertTriangle, color: "text-yellow-500" },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your business overview.</p>
        </div>
        <ReorderSuggestions />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart products={products} />
        <InventoryTable products={products} />
      </div>
    </div>
  )
}
