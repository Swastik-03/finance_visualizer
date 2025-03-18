"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, type TooltipProps } from "recharts"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  category?: string
}

interface CategoryData {
  name: string
  value: number
  color: string
}

// Define colors for categories
const CATEGORY_COLORS: Record<string, string> = {
  housing: "#FF8042",
  transportation: "#0088FE",
  food: "#00C49F",
  utilities: "#FFBB28",
  insurance: "#FF8042",
  healthcare: "#8884d8",
  entertainment: "#82ca9d",
  personal: "#ffc658",
  education: "#8dd1e1",
  savings: "#a4de6c",
  other: "#d0ed57",
}

export default function CategoryChart() {
  const [chartData, setChartData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const transactions: Transaction[] = await response.json()

        // Group transactions by category and sum amounts
        const categoryMap = new Map<string, number>()

        transactions.forEach((transaction) => {
          const category = transaction.category || "other"
          const currentAmount = categoryMap.get(category) || 0
          categoryMap.set(category, currentAmount + transaction.amount)
        })

        // Convert to chart data format
        const data: CategoryData[] = Array.from(categoryMap.entries())
          .map(([category, amount]) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: Number.parseFloat(amount.toFixed(2)),
            color: CATEGORY_COLORS[category] || "#d0ed57",
          }))
          .sort((a, b) => b.value - a.value) // Sort by value descending

        setChartData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chart data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">₹ {payload[0].value?.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of your spending by category.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-sm text-muted-foreground">Add transactions to see your category breakdown.</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

