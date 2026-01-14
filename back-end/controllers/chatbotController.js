import { routeMessage } from "../chatbot/router.js";
import { getSession } from "../chatbot/sessionStore.js";

export async function chatWithAI(req, res) {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Message and sessionId required" });
  }

  const session = getSession(sessionId);
  const response = await routeMessage(session, message);

  res.json(response);
}
