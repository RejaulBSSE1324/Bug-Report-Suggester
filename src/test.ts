import { fetchJiraTicket } from "./jira";

async function main() {
  const ticketId = process.argv[2]; // CLI input
  if (!ticketId) {
    console.error("❗ Please provide a Jira ticket ID. Example: npm run dev ME-123");
    return;
  }

  const data = await fetchJiraTicket(ticketId);
  if (data) {
    console.log("\n🎫 Ticket Summary:\n", data.summary);
    console.log("\n📝 Description:\n", data.description?.content?.[0]?.content?.[0]?.text || data.description || "No description found");
  }
}

//main();
