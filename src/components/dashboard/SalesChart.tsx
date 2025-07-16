"use client"

import type { Product } from "@/lib/types"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"

interface SalesChartProps {
  products: Product[]
}

export function SalesChart({ products }: SalesChartProps) {
  const topSellingProducts = products
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
        <CardDescription>A bar graph showing the top 5 selling items by units sold.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent))", radius: 'var(--radius)' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
