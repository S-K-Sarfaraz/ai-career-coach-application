import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    const {content, recordId, aiAgentType} = await req.json()
    const user = await currentUser()
    try {
        // Insert the Data
        const result = await db.insert(HistoryTable).values({
            recordId: recordId,
            content: content,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: (new Date()).toString(),
            aiAgentType: aiAgentType
        }) 
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(error)
    }
}


export async function PUT(req:NextRequest) {
    const {content, recordId} = await req.json()
    try {
        const result = await db.update(HistoryTable).set({
            content: content,
        }).where(eq(HistoryTable.recordId, recordId))
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const recordId = searchParams.get('recordId')
  const user = await currentUser()

  try {
    if (recordId) {
      const result = await db
        .select()
        .from(HistoryTable)
        .where(eq(HistoryTable.recordId, recordId))
      return NextResponse.json(result[0])
    } 
    
    // Ensure user email is defined before using it in the query
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    const result = await db
      .select()
      .from(HistoryTable)
      .where(eq(HistoryTable.userEmail, email))  // ✅ email is guaranteed to be string here
      .orderBy(desc(HistoryTable.id))
    return NextResponse.json(result)
    
  } catch (error) {
    return NextResponse.json({ error })
  }
}
