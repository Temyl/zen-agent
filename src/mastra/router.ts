import { registerApiRoute } from "@mastra/core/server";
import { Mastra } from "@mastra/core";
import { zenAgent } from "./agent";

export const mastra = new Mastra({
  agents: { zenAgent },
});

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const body = await c.req.json();
      const { text } = body;
      const agentId = c.req.param("agentId");

      if (!text || text.trim().length === 0) {
        return c.json(
          { error: { message: "Text is missing" } },
          400
        );
      }

      if (!agentId) {
        return c.json(
          { error: { message: "agentId not found" } },
          404
        );
      }

      // Run your tone analyzer
      const result = await zenAgent.tools.analyzeTone(text);

      // Construct the same A2A response format
      const responsePayload = {
        jsonrpc: "2.0",
        id: `req-${Date.now()}`,
        result: {
          id: `task-${Date.now()}`,
          contextId: `ctx-${Date.now()}`,
          status: {
            state: "completed",
            timestamp: new Date().toISOString(),
            message: {
              messageId: `msg-${Date.now()}`,
              role: "agent",
              parts: [
                {
                  kind: "text",
                  text: `
                  *Tone Analysis Result*  
                  **Tone:** ${result.tone}  
                  **Summary:** ${result.summary}  
                  ${result.encouragement ? `**Encouragement:** ${result.encouragement}` : ""}
                  `,
                },
              ],
              kind: "message",
            },
          },
          artifacts: [
            {
              artifactId: `artifact-${Date.now()}`,
              name: "ToneAnalysisResult",
              parts: [
                {
                  kind: "data",
                  data: result,
                },
              ],
            },
          ],
          kind: "task",
        },
      };

      return c.json(responsePayload);
    } catch (error: any) {
      console.error("A2A Route Error:", error);
      return c.json(
        {
          error: {
            code: 500,
            message: "Internal Server Error",
            details: error?.message || "Unknown error occurred",
          },
        },
        500
      );
    }
  },
});
