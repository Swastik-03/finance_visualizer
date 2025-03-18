"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Budget {
  _id: string
  category: string
  amount: number
  month: number
  year: number
  spent?: number
  percentage?: number
}

export default function BudgetList() {
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets")
        if (!response.ok) {
          throw new Error("Failed to fetch budgets")
        }
        const data = await response.json()
        setBudgets(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load budgets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBudgets()
  }, [])

  const handleDelete = (budget: Budget) => {
    setSelectedBudget(budget)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedBudget) return

    try {
      const response = await fetch(`/api/budgets/${selectedBudget._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete budget")
      }

      setBudgets(budgets.filter((b) => b._id !== selectedBudget._id))
      toast({
        title: "Budget deleted",
        description: "Your budget has been deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Budgets</CardTitle>
        <CardDescription>View and manage your monthly budgets.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No budgets found.</p>
            <p className="text-sm text-muted-foreground">Set a budget to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget._id}>
                    <TableCell className="font-medium capitalize">{budget.category}</TableCell>
                    <TableCell>₹ {budget.amount.toFixed(2)}</TableCell>
                    <TableCell>₹ {budget.spent?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={budget.percentage || 0} className="h-2" />
                        <span className="text-xs">{Math.round(budget.percentage || 0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the budget.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

