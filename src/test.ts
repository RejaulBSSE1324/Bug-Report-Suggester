import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log("✅ Available Gemini Models:\n");
    for (const model of models) {
      console.log(`- ${model.name}`);
    }
  } catch (error: any) {
    console.error("❌ Failed to list models:", error.message);
  }
}

listAvailableModels();
