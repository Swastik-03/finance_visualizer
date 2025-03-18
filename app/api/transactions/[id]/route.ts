import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    if (!data.description || !data.amount || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          description: data.description,
          amount: data.amount,
          date: new Date(data.date),
          category: data.category || "other",
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("transactions").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}

