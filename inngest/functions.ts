import { db } from "@/configs/db";
import { inngest } from "./client";
import { createAgent, anthropic, openai, gemini } from '@inngest/agent-kit';
import ImageKit from "imagekit";
import { HistoryTable } from "@/configs/schema";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "3s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );

var imagekit = new ImageKit({
    // @ts-ignore
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    // @ts-ignore
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    // @ts-ignore
    urlEndpoint : process.env.IMAGEKIT_ENDPOINT_URL
});

// All the Agents for the Ai 
export const AiCareerChatAgent = createAgent({
    name: "AiCareerChatAgent",
    description: 'An AI agent that answer the career related question.',
    system: `You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers, including job search advice, interview preparation, resume improvement, skill development, career transitions, and industry trends. Always respond with clarity, encouragement, and actionable advice tailored to the user's needs. If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest relevant career-focused questions instead`,
    model:gemini({
        model:"gemini-2.0-flash",
        apiKey:process.env.GEMINI_API_KEY
    })
})

export const AiResumeAnalyzerAgent = createAgent({
  name:"AiResumeAnalyzerAgent",
  description:"Ai Resume Analyzer Agent help to return Report.",
  system:`You are an advanced AI Resume Analyzer Agent.

Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.



📤 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:



overall_score (0–100)



overall_feedback (short message e.g., "Excellent", "Needs improvement")



summary_comment (1–2 sentence evaluation summary)



Section scores for:



Contact Info



Experience



Education



Skills



Each section should include:



score (as percentage)



Optional comment about that section



Tips for improvement (3–5 tips)



What’s Good (1–3 strengths)



Needs Improvement (1–3 weaknesses)



🧠 Output JSON Schema:

json

Copy

Edit

{

  "overall_score": 85,

  "overall_feedback": "Excellent!",

  "summary_comment": "Your resume is strong, but there are areas to refine.",

  "sections": {

    "contact_info": {

      "score": 95,

      "comment": "Perfectly structured and complete."

    },

    "experience": {

      "score": 88,

      "comment": "Strong bullet points and impact."

    },

    "education": {

      "score": 70,

      "comment": "Consider adding relevant coursework."

    },

    "skills": {

      "score": 60,

      "comment": "Expand on specific skill proficiencies."

    }

  },

  "tips_for_improvement": [

    "Add more numbers and metrics to your experience section to show impact.",

    "Integrate more industry-specific keywords relevant to your target roles.",

    "Start bullet points with strong action verbs to make your achievements stand out."

  ],

  "whats_good": [

    "Clean and professional formatting.",

    "Clear and concise contact information.",

    "Relevant work experience."

  ],

  "needs_improvement": [

    "Skills section lacks detail.",

    "Some experience bullet points could be stronger.",

    "Missing a professional summary/objective."

  ]

}

`,
  model:gemini({
      model:"gemini-2.0-flash",
      apiKey:process.env.GEMINI_API_KEY
  })
})

export const AiRoadmapGeneratorAgent = createAgent({
  name: 'AiRoadmapGeneratorAgent',
  description: "Generate Detail Tree Like Flow Roadmap",
  system: `
You are an AI assistant tasked with generating a roadmap in the form of a tree-like React Flow diagram.

🎯 GOAL:

Structure the roadmap similar to roadmap.sh

Order steps from fundamentals to advanced

Include branching paths for different specializations (e.g., Frontend, Backend, DevOps)

Ensure the layout is clean, readable, and clearly spaced

🧩 Spacing Rules:

Leave at least 500px horizontal (x) spacing between sibling nodes

Leave at least 300px vertical (y) spacing between parent → child nodes

Children must be aligned under their parent nodes

Spread out branches evenly to prevent overlap

Keep plenty of whitespace around each node

🧱 Each node must include:

id: A unique string identifier

type: Always "turbo"

position: With structured { x, y } coordinates, respecting the spacing rules above

data:

title: A short, meaningful title

description: Maximum 2-line summary of the concept

link: A valid URL pointing to a helpful resource

🔗 Each edge must:

Connect source → target by their respective ids

Use id format: "e<source>-<target>"

⛔️ Restrictions:

Return a valid JSON object only

Do not include markdown, explanations, or comments

🧠 JSON Format Example:

{
  "roadmapTitle": "Frontend Developer Roadmap",
  "description": "A structured path to becoming a proficient frontend developer, covering fundamentals to advanced concepts.",
  "duration": "6 months",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "HTML Basics",
        "description": "Covers HTML structure, tags, and semantics.",
        "link": "https://developer.mozilla.org/en-US/docs/Web/HTML"
      }
    },
    {
      "id": "2",
      "type": "turbo",
      "position": { "x": 0, "y": 300 },
      "data": {
        "title": "CSS Fundamentals",
        "description": "Covers box model, layouts, and styling rules.",
        "link": "https://developer.mozilla.org/en-US/docs/Web/CSS"
      }
    }
  ],
  "initialEdges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}

`,
  model:gemini({
      model:"gemini-2.0-flash",
      apiKey:process.env.GEMINI_API_KEY
  })
})

// All the crate function to provide which task should be done by the agent
export const AiCareerAgent = inngest.createFunction(
    {id: 'AiCareerAgent'},
    {event: 'AiCareerAgent'},
    async({event, step})=>{
        const {userInput} = await event?.data;
        const result = await AiCareerChatAgent.run(userInput);
        return result
    }
)

export const AiResumeAgent = inngest.createFunction(
  {id: "AiResumeAgent"},
  {event: "AiResumeAgent"},
  async ({event, step})=>{
    const {recordId, base64ResumeFile, pdfText, aiAgentType, userEmail} = await event?.data;
    // Upload file to the cloud storage 
    const uploadFileUrl = await step.run("uploadImage", async()=>{
      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName: `${Date.now()}.pdf`,
        isPublished: true
      })
      return imageKitFile.url
    })

    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText)
    // @ts-ignore
    const rawContent = aiResumeReport.output[0].content;
    const rawContentJson = rawContent.replace('```json', '').replace('```', '')
    const parseJson = JSON.parse(rawContentJson)

    // Adding the data to the db
    const saveToDb = await step.run('SaveToData', async()=>{
      const result=  await db.insert(HistoryTable).values({
        recordId: recordId,
        content: parseJson,
        aiAgentType: aiAgentType,
        createdAt: (new Date()).toString(),
        userEmail: userEmail,
        metaData: uploadFileUrl
      })
      console.log(result)
      return parseJson
    })
  }
)

export const AiRoadmapAgent = inngest.createFunction(
  { id: "AiRoadmapAgent" },
  { event: "AiRoadmapAgent" },
  async ({ event, step }) => {
    const { roadmapId, userInput, userEmail } = event.data;

    const roadmapResult = await AiRoadmapGeneratorAgent.run("UserInput: " + userInput);

    const message = roadmapResult.output?.[0];

    if (!message || message.role !== "assistant" || !("content" in message)) {
      throw new Error("AI response did not contain a valid content message");
    }

    const rawContent = message.content as string;

    const rawContentJson = rawContent.replace(/```json|```/g, "").trim();

    let parseJson;
    try {
      parseJson = JSON.parse(rawContentJson);
    } catch (e) {
      console.error("Failed to parse AI response JSON", e);
      throw new Error("Invalid JSON format returned by AI");
    }

    // Save to DB
    const saveToDb = await step.run("SaveToData", async () => {
      const result = await db.insert(HistoryTable).values({
        recordId: roadmapId,
        content: parseJson,
        aiAgentType: "/ai-tools/ai-roadmap-agent",
        createdAt: new Date().toString(),
        userEmail: userEmail,
        metaData: userInput,
      });
      console.log(result);
      return parseJson;
    });

    return saveToDb;
  }
);
