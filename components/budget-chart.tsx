"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

interface Budget {
  _id: string
  category: string
  amount: number
  month: number
  year: number
  spent?: number
  percentage?: number
}

interface ChartData {
  name: string
  budget: number
  spent: number
}

export default function BudgetChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets")
        if (!response.ok) {
          throw new Error("Failed to fetch budgets")
        }
        const budgets: Budget[] = await response.json()

        // Convert to chart data format
        const data: ChartData[] = budgets.map((budget) => ({
          name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
          budget: budget.amount,
          spent: budget.spent || 0,
        }))

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

    fetchBudgets()
  }, [])

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">Budget: ₹ {payload[0].value?.toFixed(2)}</p>
          <p className="text-black">Spent: ₹ {payload[1].value?.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>Compare your budgeted amounts with actual spending.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-sm text-muted-foreground">Set budgets to see comparisons.</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹ ${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="var(--chart-1)" />
                <Bar dataKey="spent" name="Spent" fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

