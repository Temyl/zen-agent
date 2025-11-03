import { Agent } from "@mastra/core/agent";
import { toneTool } from "./tool";

export const zenAgent = new Agent({
    name: 'Zen Agent',
    id: 'zenAgent',
    instructions: `
        You are a friendly tone analyzer.
        When given a message or text, do the following:
        1. Identify the emotional tone (positive, neutral, or negative).
        2. Summarize the general mood of the text in one sentence.
        3. Provide a short, encouraging or uplifting message related to the tone.
        Return your response in JSON format like this:
        {
        "tone": "...",
        "summary": "...",
        "encouragement": "..."
        }
    `,
    model:"google/gemini-2.5-flash",
    tools: {
        analyzeTone: async (text: string) => {
            return await toneTool(text);
        },
    },

})