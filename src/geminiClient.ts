import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const JIRA_EMAIL = process.env.JIRA_EMAIL!;
const JIRA_API_KEY = process.env.JIRA_API_KEY!;

export async function downloadImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_KEY}`).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image. Status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function getFeedbackFromGemini(summary: string, description: string, imageUrl?: string): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const parts: any[] = [
      {
        text:
          `You are a QA lead reviewing a bug report.\n\nTitle: ${summary}\n\nDescription: ${description}\n\nPlease provide clear suggestions to improve this bug report.`,
      },
    ];

    // 🖼️ Add image if available
    if (imageUrl) {
      const base64Image = await downloadImageAsBase64(imageUrl);
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message);
    return null;
  }
}
