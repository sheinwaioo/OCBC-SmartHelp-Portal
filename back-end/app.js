import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatWithAI } from "./controllers/chatbotController.js";
import { authenticateSession } from "./chatbot/sessionStore.js";

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

// Chatbot endpoint
app.post("/api/chat", chatWithAI);

// ⚠️ TEMPORARY LOGIN ENDPOINT (FOR TESTING ONLY)
app.post("/api/login-test", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  authenticateSession(sessionId);
  res.json({ success: true });
});

// ==========================================

export default app;
