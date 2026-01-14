const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// ✅ One session per page load
const sessionId = crypto.randomUUID();

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

// ---------------- SEND MESSAGE ----------------
async function handleSend(messageOverride = null) {
  const message = messageOverride ?? userInput.value.trim();
  if (!message) return;

  // Show user message
  addMessage(message, "user");
  userInput.value = "";

  // Thinking indicator
  const thinking = addMessage("Thinking...", "ai");

  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message,
      }),
    });

    const data = await res.json();

    // Replace thinking message
    thinking.remove();

    // Show bot message
    if (data.message) {
      addMessage(data.message, "ai");
    }

    // 🔘 Render FSM options
    if (data.options) {
      renderOptions(data.options);
    }

    // 🔐 Handle auth requirement
    if (data.authRequired) {
      renderLoginButton();
    }

  } catch (err) {
    thinking.textContent = "Unable to reach backend service.";
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ---------------- OPTIONS ----------------
function renderOptions(options) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-options";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn light";
    btn.textContent = opt;

    btn.onclick = () => handleSend(opt);
    wrapper.appendChild(btn);
  });

  chatMessages.appendChild(wrapper);
}

// ---------------- LOGIN (TEMP DEMO) ----------------
function renderLoginButton() {
  const btn = document.createElement("button");
  btn.className = "btn ai";
  btn.textContent = "Log in to continue";

  btn.onclick = async () => {
    await fetch("http://localhost:3000/api/login-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    addMessage("You are now logged in.", "ai");
  };

  chatMessages.appendChild(btn);
}

// ---------------- MESSAGE UI ----------------
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;

  if (sender === "ai") {
    msg.innerHTML = formatText(text);
  } else {
    msg.textContent = text;
  }

  chatMessages.appendChild(msg);
  return msg;
}

// ---------------- FORMATTER ----------------
function formatText(text) {
  if (!text) return "";

  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
