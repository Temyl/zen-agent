import express, { Request, Response } from 'express'
import { ApplicationError } from '../internals/error';
import { StatusCodes } from 'http-status-codes';
import { zenAgent } from '../internals/agents';

// export class a2aAgentRoute {
//   private readonly route: Ro
// }
const router = express.Router();

router.post(
  '/a2a/agent/:agentId',
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        throw new ApplicationError(
          StatusCodes.BAD_REQUEST,
          'Text is missing'
        );
      }

      const agentId = req.params.agentId;

      if (!agentId) {
        throw new ApplicationError(
          StatusCodes.NOT_FOUND,
          'agentId not found'
        );
      }

      const result = await zenAgent.tools.analyzeTone(text);

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

      res.status(StatusCodes.OK).json(responsePayload);

    } catch (error: any) {
      console.error("A2A Route Error:", error);

    
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Internal Server Error",
          details: error?.message || "Unknown error occurred",
        },
      });
    }
  }
);

export default router;