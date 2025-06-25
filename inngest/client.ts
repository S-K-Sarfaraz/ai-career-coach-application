import { Inngest } from "inngest";

console.log("Inngest event key:", process.env.INNGEST_EVENT_KEY);

export const inngest = new Inngest({
  id: "ai-career-coach-agent",
  eventKey: process.env.INNGEST_EVENT_KEY, // This is required to send events
});
