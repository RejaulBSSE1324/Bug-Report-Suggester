export function buildPrompt(summary: string, description: string): string {
  return `
MarginEdge is a restaurant  management software  tool that handles all your restaurant’s back‑of‑house tasks in one place.
It pulls in invoices and bills automatically, so you never enter data by hand.
Inventory counts and costs update in real time, helping you cut waste and save money.
Built‑in recipe costing and menu analysis show you which dishes make you the most profit.
It plugs into your POS and accounting software for a single, up‑to‑date view of your business.

Provide your feedback as a concise bulleted list. Be brief and direct.

---

**Title:** ${summary}

**Description:** ${description}

---
  `.trim();
}
