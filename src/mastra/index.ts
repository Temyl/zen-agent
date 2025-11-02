// src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { zenAgent } from "./agent";

export const mastra = new Mastra({
  agents: { zenAgent},
});
