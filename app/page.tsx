import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transaction-list";
import TransactionForm from "@/components/transaction-form";
import ExpensesChart from "@/components/expenses-chart";
import CategoryChart from "@/components/category-chart";
import BudgetForm from "@/components/budget-form";
import BudgetList from "@/components/budget-list";
import BudgetChart from "@/components/budget-chart";
import Dashboard from "@/components/dashboard";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-6 md:px-10 bg-[#F4F4F4] min-h-screen">
      <div className="flex flex-col space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#2C3E50]">Personal Finance Visualizer</h1>
          <p className="text-[#008080] text-lg">Track your expenses, set budgets, and visualize your spending habits</p>
        </div>
        <Separator className="border-[#008080]" />
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto bg-[#008080] text-white rounded-lg shadow-lg">
            <TabsTrigger value="dashboard" className="hover:bg-[#2ECC71] px-4 mx-2 rounded-lg transition">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions" className="hover:bg-[#2ECC71] px-4 mx-2 rounded-lg transition">Transactions</TabsTrigger>
            <TabsTrigger value="budgets" className="hover:bg-[#2ECC71] px-4 mx-2 rounded-lg transition">Budgets</TabsTrigger>
            <TabsTrigger value="charts" className="hover:bg-[#2ECC71] px-4 mx-2 rounded-lg transition">Charts</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6 p-4 bg-white shadow-md rounded-lg border border-[#F39C12]">
            <Dashboard />
          </TabsContent>
          <TabsContent value="transactions" className="space-y-6 p-4 bg-white shadow-md rounded-lg border border-[#F39C12]">

            <Tabs defaultValue="TransactionList" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto text-white bg-white p-1">
                <TabsTrigger
                  value="TransactionList"
                  className="hover:bg-[#2ECC71] bg-[#008080] data-[state=active]:bg-[#22B573] px-4 mx-2 rounded-lg transition"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="TransactionForm"
                  className="hover:bg-[#2ECC71] bg-[#008080] data-[state=active]:bg-[#22B573] px-4 mx-2 rounded-lg transition"
                >
                  Add Transaction
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="TransactionList"
                className="space-y-6 p-4 text-[#2C3E50]"
              >
                <TransactionList />
              </TabsContent>
              <TabsContent
                value="TransactionForm"
                className="space-y-6 p-4 text-[#2C3E50]"
              >
                <TransactionForm />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="budgets" className="space-y-6 p-4 bg-white shadow-md rounded-lg border border-[#F39C12]">
            <div className="grid gap-6 md:grid-cols-2">
              <BudgetForm />
              <BudgetList />
            </div>
          </TabsContent>
          <TabsContent value="charts" className="space-y-6 p-4 bg-white shadow-md rounded-lg border border-[#F39C12]">
            <div className="grid gap-6 md:grid-cols-2">
              <ExpensesChart />
              <CategoryChart />
            </div>
            <BudgetChart />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
