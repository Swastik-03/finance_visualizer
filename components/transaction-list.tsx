"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import TransactionEditForm from "./transaction-edit-form"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  category?: string
}

export default function TransactionList() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setOpenEditDialog(true)
  }

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedTransaction) return

    try {
      const response = await fetch(`/api/transactions/${selectedTransaction._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      setTransactions(transactions.filter((t) => t._id !== selectedTransaction._id))
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View and manage your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No transactions found.</p>
            <p className="text-sm text-muted-foreground">Add a transaction to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>₹ {transaction.amount.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{transaction.category || "other"}</TableCell>
                    <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>Make changes to your transaction here.</DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <TransactionEditForm
                transaction={selectedTransaction}
                onSuccess={() => {
                  setOpenEditDialog(false)
                  router.refresh()
                  // Refresh the transaction list
                  fetch("/api/transactions")
                    .then((res) => res.json())
                    .then((data) => setTransactions(data))
                    .catch(() => {
                      toast({
                        title: "Error",
                        description: "Failed to refresh transactions.",
                        variant: "destructive",
                      })
                    })
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the transaction.
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

