import axios from "axios";

/**
 * Fetches a Jira ticket's details using the Jira API.
 * @param ticketId - The ticket ID or key (e.g., "ME-12345").
 * @returns A promise that resolves to the ticket's data.
 */
export async function fetchJiraTicket(ticketId: string): Promise<any> {
  const { JIRA_API_KEY, JIRA_EMAIL, JIRA_DOMAIN } = process.env;

  if (!JIRA_API_KEY || !JIRA_EMAIL || !JIRA_DOMAIN) {
    throw new Error("Jira API configuration is missing in your .env file.");
  }

  const url = `https://${JIRA_DOMAIN}/rest/api/3/issue/${ticketId}`;

  // Create a base64-encoded authentication string
  const authString = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_KEY}`).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Basic ${authString}`,
        "Accept": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    // Handle errors and provide clear error messages.
    throw new Error(`Error fetching ticket ${ticketId}: ${error.response?.data || error.message}`);
  }
}
