import { STATES } from "./flow.js";

const sessions = new Map();

/**
 * Get or create a session
 */
export function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createNewSession());
  }
  return sessions.get(sessionId);
}

/**
 * Create a fresh session object
 */
function createNewSession() {
  return {
    state: STATES.START,        // current FSM state
    pendingState: null,         // state to resume after login
    data: {},                   // collected flow data (category, help type, etc.)
    isAuthenticated: false,     // auth flag
    createdAt: new Date(),      // debug / audit
  };
}

/**
 * Mark session as authenticated (fake login for demo)
 * Also resumes pending FSM state if any
 */
export function authenticateSession(sessionId) {
  const session = getSession(sessionId);
  session.isAuthenticated = true;

  // ✅ Resume blocked flow after login
  if (session.pendingState) {
    session.state = session.pendingState;
    session.pendingState = null;
  }

  return session;
}

/**
 * Reset session (restart conversation)
 */
export function resetSession(sessionId) {
  sessions.set(sessionId, createNewSession());
}

/**
 * Optional: Debug helper
 */
export function getAllSessions() {
  return Array.from(sessions.entries());
}
