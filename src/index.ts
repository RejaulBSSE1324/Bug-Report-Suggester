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

        // 3. Handle attachments
        const attachments = ticketData.fields.attachment || [];
        const screenshotInfo = attachments.length > 0
            ? `The report includes ${attachments.length} attachment(s), including possible screenshots.`
            : `No attachments are included in the report.`;

        // 4. Show details in console
        console.log("\n🎫 Ticket Summary:\n", summary);
        console.log("\n📝 Ticket Description:\n", description);
        console.log("\n📎 Attachment Info:\n", screenshotInfo);


        const imageAttachment = attachments.find((att: any) =>
            att.mimeType?.startsWith("image/")
        );

        if (!imageAttachment) {
            console.log("❗ No valid image attachments found. Skipping image analysis.");
            return;
        }

        const imageUrl = imageAttachment.content;


        // 5. Build prompt and get Gemini feedback
        console.log("\n🤖 Sending to Gemini for QA feedback...");
        //const imageUrl = attachments[0]?.content; // first attachment if exists
        const feedback = await getFeedbackFromGemini(summary, description, imageUrl);


        // 6. Output Gemini's response
        console.log("\n✅ Gemini Suggestions:\n");
        console.log(feedback || "⚠️ No suggestions were returned.");
    } catch (error: any) {
        console.error("❌ An error occurred:", error.message);
    }
}

main().finally(() => process.exit(0));


