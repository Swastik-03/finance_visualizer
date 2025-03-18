import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get current month and year
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Get all budgets for the current month
    const budgets = await db
      .collection("budgets")
      .find({
        month: currentMonth,
        year: currentYear,
      })
      .toArray()

    // Get all transactions for the current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1)
    const endOfMonth = new Date(currentYear, currentMonth, 0)

    const transactions = await db
      .collection("transactions")
      .find({
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .toArray()

    // Calculate spent amount for each budget
    const result = budgets.map((budget) => {
      const categoryTransactions = transactions.filter((t) => t.category === budget.category)

      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)

      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

      return {
        ...budget,
        spent,
        percentage,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    if (!data.category || !data.amount || !data.month || !data.year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if budget already exists for this category and month
    const existingBudget = await db.collection("budgets").findOne({
      category: data.category,
      month: data.month,
      year: data.year,
    })

    if (existingBudget) {
      // Update existing budget
      await db.collection("budgets").updateOne(
        { _id: existingBudget._id },
        {
          $set: {
            amount: data.amount,
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({ id: existingBudget._id }, { status: 200 })
    } else {
      // Create new budget
      const result = await db.collection("budgets").insertOne({
        category: data.category,
        amount: data.amount,
        month: data.month,
        year: data.year,
        createdAt: new Date(),
      })
      
      return NextResponse.json({ id: result.insertedId }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}

