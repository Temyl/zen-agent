# 🧭 Zen Agent – Tone Analyzer API

A simple, AI-powered tone analysis microservice built with **Node.js**, **Express**, and **Mastra**.  
The Zen Agent uses **Google Gemini AI** to analyze emotional tone (Positive, Negative, Neutral, Unknown) from user messages.

---

## 🚀 Features

- 🔍 **Tone Analysis** — Detects emotional tone (positive / negative / neutral / unknown)
- 💬 **Summarization** — Provides a short explanation of the tone
- 🌱 **Encouragement** — Offers a motivational message for negative tones
- ⚙️ **REST API** — Simple HTTP endpoints for integration
- 🧠 **Mastra Agent Integration** — Designed for easy deployment in the Mastra AI framework
- 🔐 **Environment-based Configuration** — API keys loaded securely from `.env`

## Install Dependencies
npm install

# Create .env File

# Create a .env file in the root directory and add:

GEMINI_API_KEY=your_google_gemini_api_key


# You can get your API key from Google AI Studio


## Running the Project Locally
npm run dev


The server should start at:

http://localhost:8110


You should see:

{
  "message": " Tone Analyzer Agent API is live!",
  "status": 200,
  "timestamp": "2025-11-02T12:00:00Z"
}

## API Usage
POST /analyze

Request Body:

{
  "text": "I'm feeling great today!"
}


Response:

{
  "tone": "positive",
  "summary": "The message expresses happiness or satisfaction.",
  "encouragement": null
}


For a negative message:

{
  "tone": "negative",
  "summary": "The message conveys sadness or disappointment.",
  "encouragement": "Don't lose hope — things will get better soon."
}

## Deployment on Mastra
- Install Mastra globally (if not already):
- npm install -g @mastra/cli
- Login to your Mastra account:
- mastra login
- Deploy your agent:
- mastra deploy
- Your service will be live and available under your Mastra workspace!

## Technologies Used
- Node.js
- Express.js
- Mastra AI Framework
- Google Gemini API
- Zod
- TypeScript

## Example Agent Definition
// src/internals/agents/index.ts
import { Agent } from "@mastra/core";
import { toneTool } from "../tools";

export const zenAgent = new Agent({
  name: "Zen Agent",
  description: "Analyzes text tone using Gemini AI",
  tools: {
    analyzeTone: toneTool,
  },
});

## Example Tool
// src/internals/tools/index.ts
import { GoogleGenAI } from "@google/genai";
import z from "zod";
import dotenv from "dotenv";

dotenv.config();

export async function toneTool(text: string) {
  // implementation here
}

## Author

**OluwaDunsin Oteyola**
Backend Developer & Data Engineer

