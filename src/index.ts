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
        const ticketData = await fetchJiraTicket(ticketId);

        const summary: string = ticketData.fields.summary;
        const descriptionRaw = ticketData.fields.description;

        let description = "No description";

        if (typeof descriptionRaw === "string") {
            description = descriptionRaw;
        } else if (descriptionRaw?.content) {
            // Try to extract all plain text content from the rich-text structure
            description = descriptionRaw.content
                .map((block: any) => block.content?.map((inner: any) => inner.text).join(" ") || "")
                .join("\n");
        }



        const attachments = ticketData.fields.attachment || [];

        const hasScreenshotOrLoom = attachments.some((att: any) =>
            att.mimeType?.startsWith("image/") || att.filename?.toLowerCase().includes("loom")
        );


        console.log("\n🎫 Ticket Summary:\n", summary);

        const prompt = buildPrompt(summary, description, hasScreenshotOrLoom);

        console.log("\n🤖 Sending to Gemini for QA feedback...");
        const feedback = await getFeedbackFromGemini(prompt);

        if (feedback) {
            const normalized = feedback.trim().toLowerCase();
            if (
                normalized === "everything looks good" ||
                normalized.includes("everything looks fine") ||
                normalized.includes("no improvement needed")
            ) {
                console.log("\n✅ Everything looks good in this bug report!");
                process.exit(0);
            } else {
                console.log("\n✅ Gemini Suggestions:\n");
                console.log(feedback);
                process.exit(0);
            }
        } else {
            console.log("⚠️ No suggestions were returned.");
            process.exit(1);
        }

    } catch (error: any) {
        console.error("❌ An error occurred:", error.message);
        process.exit(1);
    }
}

main();
