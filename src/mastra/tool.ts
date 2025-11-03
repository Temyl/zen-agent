import z from "zod";
import { TONE } from "../internals/enum";
import { tone } from "../internals/type";

import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const  toneSchema = z.object({
    tone: z.enum([TONE.NEGATIVE, TONE.POSTIVE, TONE.NEUTRAL, TONE.UNKNOWN ]),
    summary: z.string(),
    encouragement: z.string().optional()
});



export async function toneTool(text: string): Promise<tone> {

    if (!text || text.trim().length === 0) {
        return {
            tone: "Unknown",
            summary: "No text provided for analysis.",
            encouragement: "Please share a message to analyze ",
        };
    }

    const geminiApIkey =  process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!geminiApIkey) {
        throw new Error(
            "Missing GEMINI_API_KEY in environment variables"
        );
    }

    const prompt = `
        You are a friendly tone analysis AI.
        Analyze the emotional tone of this message and return a JSON object.

        Rules:
        - tone: must be "Positive", "Negative", or "Neutral"
        - summary: a one-sentence explanation
        - encouragement: only include if tone is "Negative"

        Message: """${text}"""
    `;


    const genAI = new GoogleGenAI({ apiKey: geminiApIkey as string});

    // const model = genAI.models.generateContent({ 
    //     model: "gemini-2.5-flash",
    //     contents: prompt
    // });

    
    try {
        const response = await genAI.models.generateContent({
            model: "google/gemini-2.5-flash",
            contents: prompt,
        });

        let raw = await response.text;

        // 🧹 Clean up the response: remove code blocks and markdown formatting
        raw = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .replace(/^\s+|\s+$/g, ""); // trim spaces

        // 🧩 Extract JSON object safely (in case of extra text before/after)
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error(`No valid JSON found. Raw response: ${raw}`);
        }

        const parsed = JSON.parse(jsonMatch[0]);

        if (parsed.tone && typeof parsed.tone === "string") {
            parsed.tone = parsed.tone.toLowerCase();
        }
        const result = toneSchema.parse(parsed);

        return {
            tone: result.tone,
            summary: result.summary,
            encouragement:
            result.tone === TONE.NEGATIVE
                ? result.encouragement ||
                "Don't lose hope — things will get better soon."
                : undefined,
        };
    } catch (error) {
            console.error("Tone analysis error:", error);
            return {
                tone: TONE.UNKNOWN,
                summary: "Unable to analyze the tone.",
                encouragement: "Try again with a clearer message.",
            };
    }
    
}