export function buildPrompt(summary: string, description: string, hasScreenshotOrLoom: boolean): string {
  return `
You are a senior QA reviewer.

Please analyze the following bug report and its attachments. Your goal is to provide a clear and concise bullet-point list of suggestions to improve the report.

Focus your review on the following:

✅ Bug Title:
- Is the title too long or overly detailed? Suggest a more concise version if needed.
- Is the title clear and directly indicating the issue?

✅ Description Content:
Please analyze the following raw bug report text. if feilds present then don't mention it. If any of the following fields are missing, clearly mention them:
- Testing Environment
- Build Version ( Like Software version vBUILD-4 )
- OS (Like Windows 11,10 etc)
- Browser (Like Chrome 131 or another)

✅ Grammar & Clarity:
- Are there grammar, spelling, or clarity issues in the title or description?

✅ Attachments:
- Confirm whether at least one screenshot (image) or Loom video is attached.
- If missing, recommend attaching one for better clarity.

✅ Overall Quality:
- Is the bug report understandable for a developer?
- Could it be reproduced easily?

📌 If everything looks good, simply respond with:
"Everything looks good"

---

**Bug Title:** ${summary}

**Bug Description:** ${description}

**Attachments:** ${hasScreenshotOrLoom ? "Screenshot or Loom is present ✅" : "⚠️ No screenshot or Loom provided!"}
`.trim();
}
