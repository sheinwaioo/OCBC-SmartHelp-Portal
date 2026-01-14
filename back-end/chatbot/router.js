import { handleFlow, STATES } from "./flow.js";
import { askGemini } from "./gemini.js";

// States that require authentication
const protectedStates = [
  STATES.JOIN_QUEUE,
  STATES.SCHEDULE_CALLBACK,
];

export async function routeMessage(session, userInput) {
  // --------------------------------------------------
  // 1️⃣ Try FSM first
  // --------------------------------------------------
  const flowResponse = handleFlow(session, userInput);

  if (flowResponse) {
    // --------------------------------------------------
    // 2️⃣ Login gating (protected states)
    // --------------------------------------------------
    if (
      flowResponse.nextState &&
      protectedStates.includes(flowResponse.nextState) &&
      !session.isAuthenticated
    ) {
      // Save intended destination
      session.pendingState = flowResponse.nextState;
      session.state = STATES.AUTH_REQUIRED;

      return {
        message: "Please log in to continue.",
        authRequired: true,
      };
    }

    // --------------------------------------------------
    // 3️⃣ Persist flow data (category, subCategory, helpType)
    // --------------------------------------------------
    if (flowResponse.data) {
      session.data = {
        ...session.data,
        ...flowResponse.data,
      };
    }

    // --------------------------------------------------
    // 4️⃣ Normal FSM transition
    // --------------------------------------------------
    if (flowResponse.nextState) {
      session.state = flowResponse.nextState;
    }

    return flowResponse;
  }

  // --------------------------------------------------
  // 5️⃣ Not FSM → Gemini fallback
  // --------------------------------------------------
  const reply = await askGemini(userInput);

  return {
    message: reply,
    ai: true,
  };
}
