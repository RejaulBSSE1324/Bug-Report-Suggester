import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// At the top of your geminiClient.ts
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getFeedbackFromGemini(prompt: string): Promise<string | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const delay = parseInt(process.env.GEMINI_DELAY || "1000");
        await new Promise((res) => setTimeout(res, delay));

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        if (error.message?.includes('API key expired')) {
            console.error("❌ API Key Error: Your Gemini API key has expired. Please renew it at https://aistudio.google.com/");
        } else if (error.message?.includes('quota exceeded')) {
            console.error("❌ Quota Error: API quota exceeded. Please check your usage limits.");
        } else {
            console.error("❌ Gemini API Error:", error.message);
        }
        return null;
    }
}

