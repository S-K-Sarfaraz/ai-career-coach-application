import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-career-coach-agent",
  eventKey: process.env.INNGEST_EVENT_KEY, // This is required to send events
});
