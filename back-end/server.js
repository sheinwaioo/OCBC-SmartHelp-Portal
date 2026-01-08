import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

console.log("OPENAI KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
