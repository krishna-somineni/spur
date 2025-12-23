import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Store Policies:
- Shipping: Ships worldwide. USA delivery in 5–7 days.
- Returns: 30-day return policy. Full refund.
- Support hours: Mon–Fri, 9am–6pm IST.

Answer clearly and concisely.
`;

export type HistoryMessage = {
  sender: "user" | "ai";
  text: string;
};

export async function generateReply(history: HistoryMessage[]) {
  // Convert chat history into Gemini-compatible format
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }]
    },
    ...history.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }))
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // ✅ modern, fast model
    contents
  });

  return response.text ?? "Sorry, I couldn’t generate a response.";
}
