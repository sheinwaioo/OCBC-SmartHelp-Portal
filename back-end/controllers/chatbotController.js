import dotenv from "dotenv";
dotenv.config(); // <-- MUST be before OpenAI

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SENSITIVE_KEYWORDS = [
  "balance",
  "transfer",
  "otp",
  "password",
  "withdraw",
  "pay"
];

function isSensitive(message) {
  return SENSITIVE_KEYWORDS.some(k =>
    message.toLowerCase().includes(k)
  );
}

const chatbotController = {
  async generalChat(req, res) {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (isSensitive(message)) {
      return res.json({
        reply:
          "For security reasons, I can’t help with account-specific requests here. Would you like to speak to an OCBC agent?"
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are OCBC SmartHelp AI. Answer only general banking questions. Do not request personal data."
          },
          { role: "user", content: message }
        ],
        temperature: 0.3
      });

      res.json({ reply: response.choices[0].message.content });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "AI service temporarily unavailable"
      });
    }
  }
};

export default chatbotController;
