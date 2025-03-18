"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { AlertCircle, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Budget {
  _id: string
  category: string
  amount: number
  month: number
  year: number
  spent?: number
  percentage?: number
}

interface Insight {
  type: "warning" | "success" | "info"
  title: string
  description: string
  icon: React.ReactNode
}

export default function SpendingInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/api/budgets")
        if (!response.ok) {
          throw new Error("Failed to fetch budgets")
        }
        const budgets: Budget[] = await response.json()

        const newInsights: Insight[] = []

        // Generate insights based on budget data
        budgets.forEach((budget) => {
          const spent = budget.spent || 0
          const percentage = budget.percentage || 0

          if (percentage >= 90 && percentage < 100) {
            newInsights.push({
              type: "warning",
              title: `${budget.category.charAt(0).toUpperCase() + budget.category.slice(1)} budget almost reached`,
              description: `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget.`,
              icon: <AlertTriangle className="h-4 w-4" />,
            })
          } else if (percentage >= 100) {
            newInsights.push({
              type: "warning",
              title: `${budget.category.charAt(0).toUpperCase() + budget.category.slice(1)} budget exceeded`,
              description: `You've exceeded your ${budget.category} budget by $${(spent - budget.amount).toFixed(2)}.`,
              icon: <AlertCircle className="h-4 w-4" />,
            })
          } else if (percentage <= 20 && budget.amount > 0) {
            newInsights.push({
              type: "success",
              title: `${budget.category.charAt(0).toUpperCase() + budget.category.slice(1)} spending on track`,
              description: `You've only used ${percentage.toFixed(0)}% of your ${budget.category} budget.`,
              icon: <TrendingDown className="h-4 w-4" />,
            })
          }
        })

        // Add general insights if we have enough data
        if (budgets.length > 0) {
          const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
          const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
          const overallPercentage = (totalSpent / totalBudget) * 100

          if (overallPercentage < 50) {
            newInsights.push({
              type: "success",
              title: "Overall spending on track",
              description: `You've used ${overallPercentage.toFixed(0)}% of your total budget.`,
              icon: <TrendingDown className="h-4 w-4" />,
            })
          } else if (overallPercentage >= 80) {
            newInsights.push({
              type: "warning",
              title: "Watch your overall spending",
              description: `You've used ${overallPercentage.toFixed(0)}% of your total budget.`,
              icon: <TrendingUp className="h-4 w-4" />,
            })
          }
        }

        setInsights(newInsights)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load insights. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return (
    <Card className="bg-white shadow-md border border-[#F39C12]">
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Smart insights based on your spending habits.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No insights available.</p>
            <p className="text-sm text-muted-foreground">Add more transactions and set budgets to get insights.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} variant={insight.type === "warning" ? "destructive" : "default"}>
                {insight.icon}
                <AlertTitle>{insight.title}</AlertTitle>
                <AlertDescription>{insight.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

