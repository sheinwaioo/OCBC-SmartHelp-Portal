import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const SYSTEM_PROMPT = `
You are OCBC SmartHelp AI, a virtual assistant for OCBC Bank.

You are allowed to:
- Explain OCBC banking services and products
- Guide users on accounts, cards, and digital banking features
- Answer general banking questions
- Provide help with security, PIN reset, and support processes
- Share OCBC history and public information

You are NOT allowed to:
- Perform transactions
- Access or modify user data
- Request personal information
- Decide chatbot flow or actions

If a user wants to proceed, instruct them to use the available options.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(message) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "user", parts: [{ text: message }] },
    ],
  });

  return (
    result.response?.text() ||
    "I can help explain OCBC services. Please select an option to continue."
  );
}
