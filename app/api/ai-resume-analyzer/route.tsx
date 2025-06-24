import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { getRuns } from "@/lib/inngest/getRuns";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile") as File;
    const recordId = formData.get("recordId");

    // ✅ Convert to Blob directly — this is already a File object (in Edge Runtime)
    const loader = new WebPDFLoader(resumeFile); 
    const docs = await loader.load();
    const user = await currentUser();

    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const resultIds = await inngest.send({
        name: 'AiResumeAgent',
        data: {
            recordId: recordId,
            base64ResumeFile: base64,
            pdfText: docs[0]?.pageContent,
            aiAgentType: "/ai-tools/ai-resume-analyzer",
            userEmail: user?.primaryEmailAddress?.emailAddress,
        }
    });

    const runId = resultIds?.ids[0];
    let runStatus;

    while (true) {
        runStatus = await getRuns(runId);
        if (runStatus?.data[0]?.status === "Completed") break;
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return NextResponse.json("success");
}
