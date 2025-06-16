import dotenv from "dotenv";
import { fetchJiraTicket } from "./jira";
import { getFeedbackFromGemini } from "./geminiClient";
import { buildPrompt } from "./prompts";

dotenv.config();

async function main() {
    console.log("🛠️  Bug Report Suggester CLI");

    const ticketId = process.argv[2];
    if (!ticketId) {
        console.error("❗ Please provide a Jira ticket ID. Example: npm run dev -- ME-12345");
        process.exit(1);
    }

    try {
        // 1. Fetch Jira ticket
        const ticketData = await fetchJiraTicket(ticketId);

        // 2. Extract summary and description
        const summary: string = ticketData.fields.summary;
        const descriptionRaw = ticketData.fields.description;

        // Handle Jira's rich-text format or plain text
        let description = "No description";
        if (typeof descriptionRaw === "string") {
            description = descriptionRaw;
        } else if (descriptionRaw?.content?.[0]?.content?.[0]?.text) {
            description = descriptionRaw.content[0].content[0].text;
        }

        console.log("\n🎫 Ticket Summary:\n", summary);
        console.log("\n📝 Ticket Description:\n", description);

        // 3. Build prompt and get suggestions from Gemini
        console.log("\n🤖 Sending to Gemini for QA feedback...");
        const prompt = buildPrompt(summary, description);
        // const prompt= "what is the meaning of OLI ( bangali ) in arabic";
        const feedback = await getFeedbackFromGemini(prompt);

        // 4. Output Gemini's response
        console.log("\n✅ Gemini Suggestions:\n");
        console.log(feedback || "⚠️ No suggestions were returned.");
    } catch (error: any) {
        console.error("❌ An error occurred:", error.message);
    }
}

main();
