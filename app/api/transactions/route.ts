import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    if (!data.description || !data.amount || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await db.collection("transactions").insertOne({
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      category: data.category || "other",
      createdAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

