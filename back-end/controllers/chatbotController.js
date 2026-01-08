import dotenv from "dotenv";
dotenv.config(); // <-- MUST be before OpenAI
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const chatWithAI = async (req, res) => {
//   try{
//     const {message} = req.body;

//     if(!message){
//       return res.status(400).json({ error: "Message is required" });
//     }

//     const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a professional banking assistant. You only answer general banking questions. You do not perform transactions or access personal data."
//       },
//       {
//         role: "user",
//         content: message
//       }
//     ]
//   });
//   const reply = completion.choices[0].message.content;

//   res.json({reply});
//   }
//   catch(error){
//     console.error("Chatbot error:", error);
//     res.status(500).json({ error: "AI service failed" });
//   }
// }

// export default { chatWithAI };

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ✅ CORRECT MODEL (free + supported)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "AI service error" });
  }
}

export default { chatWithAI };