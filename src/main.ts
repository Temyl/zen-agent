import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { Mastra } from "@mastra/core";
import { zenAgent } from "./mastra/agent";
import { toneTool } from "./mastra/tool";
import { a2aAgentRoute } from "./mastra/router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "🧭 Tone Analyzer Agent API is live!",
        status: StatusCodes.OK,
        timestamp: new Date().toISOString(),
    });
});


app.use("/", a2aAgentRoute['']);

const mastra = new Mastra({
    agents: {zenAgent},
    // tools: [toneTool]
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({
        error: {
        code: err.status || 500,
        message: err.message || "Internal Server Error",
        },
    });
});


const PORT = 8110;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
