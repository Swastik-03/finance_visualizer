"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BadgeIndianRupee , CreditCard, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import SpendingInsights from "@/components/spending-insights";

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
}

interface CategoryTotal {
  category: string;
  total: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [topCategories, setTopCategories] = useState<CategoryTotal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);

        const total = data.reduce((sum, t) => sum + t.amount, 0);
        setTotalExpenses(total);

        const categoryMap = new Map<string, number>();
        data.forEach((transaction) => {
          const category = transaction.category || "Other";
          const currentAmount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentAmount + transaction.amount);
        });

        const topCats = Array.from(categoryMap.entries())
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        setTopCategories(topCats);

        const recent = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
        setRecentTransactions(recent);
      } catch (error) {
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#008080] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BadgeIndianRupee className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {totalExpenses.toFixed(2)}</div>
            <p className="text-xs">All time total expenses</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2ECC71] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs">Total number of transactions</p>
          </CardContent>
        </Card>
        <Card className="bg-[#F39C12] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{topCategories.length > 0 ? topCategories[0].category : "N/A"}</div>
            <p className="text-xs">{topCategories.length > 0 ? `₹ ${topCategories[0].total.toFixed(2)} total spent` : "No data available"}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2C3E50] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Transaction</CardTitle>
            <Calendar className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTransactions.length > 0 ? format(new Date(recentTransactions[0].date), "MMM d") : "N/A"}</div>
            <p className="text-xs">{recentTransactions.length > 0 ? recentTransactions[0].description : "No transactions yet"}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md border border-[#F39C12]">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your 5 most recent transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-gray-500">No transactions found.</p>
                <p className="text-sm text-gray-400">Add a transaction to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.category || "Other"} • {format(new Date(transaction.date), "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-base font-bold text-[#008080]">₹{transaction.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <SpendingInsights />
      </div>
    </div>
  );
}
