import { inngest } from "@/inggest/client";
import JSONL from 'jsonl-parse-stringify';

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.fetch(event.data.transcriptUrl);
    const transcript = await step.run("parse-transcript", async () => {
      const text = await response.text();
      return JSONL.parse(text);
    });
  }
);