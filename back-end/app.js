import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatbotController from "./controllers/chatbotController.js";

dotenv.config();

const app = express();

// Global middleware (HealthyLah style)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OCBC SmartHelp backend running" });
});

// Chatbot (general AI)
app.post("/api/chatbot/general", chatbotController.generalChat);

// ==========================================

export default app;
