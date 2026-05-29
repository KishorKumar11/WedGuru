import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
});

const SYSTEM_PROMPT =
  "You are WedGuru, a warm and expert wedding planning assistant. Help couples plan every detail of their wedding — suggest task timelines, budget breakdowns, vendor questions, checklist priorities, seating tips, and guest management advice. Be concise, practical, and encouraging. Keep replies under 300 words unless a detailed breakdown is truly needed.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...parsed.data.messages,
    ],
    max_tokens: 600,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content ?? "Sorry, I could not generate a response.";
  return res.status(200).json({ reply });
}
