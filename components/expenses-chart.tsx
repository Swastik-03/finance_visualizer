"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
}

interface MonthlyData {
  name: string
  total: number
  month: string
}

export default function ExpensesChart() {
  const [chartData, setChartData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const transactions: Transaction[] = await response.json()

        // Generate data for the last 6 months
        const today = new Date()
        const sixMonthsAgo = subMonths(today, 5)

        const months = eachMonthOfInterval({
          start: startOfMonth(sixMonthsAgo),
          end: endOfMonth(today),
        })

        const monthlyData = months.map((month) => {
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)

          const monthTransactions = transactions.filter((t) => {
            const date = new Date(t.date)
            return date >= monthStart && date <= monthEnd
          })

          const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

          return {
            name: format(month, "MMM"),
            month: format(month, "MMM yyyy"),
            total: Number.parseFloat(total.toFixed(2)),
          }
        })

        setChartData(monthlyData)
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

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].payload.month}</p>
          <p className="text-primary">₹ {payload[0].value?.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your spending over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-sm text-muted-foreground">Add transactions to see your monthly expenses.</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹ ${value}`} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

