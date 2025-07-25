import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getRuns } from "@/lib/inngest/getRuns";

export async function POST(req:NextRequest) {
    const {roadmapId, userInput} = await req.json()
    const user = await currentUser()

    const resultIds = await inngest.send({
        name: "AiRoadmapAgent",
        data: {
            userInput: userInput,
            roadmapId: roadmapId,
            userEmail: user?.primaryEmailAddress?.emailAddress
        }
    })
    const runId = resultIds?.ids[0];

    let runStatus;
    while(true){
        runStatus= await getRuns(runId)
        if(runStatus?.data[0]?.status==="Completed")
            break

        await new Promise(resolve=>setTimeout(resolve,500))
    }

    return NextResponse.json("success")
}
 

