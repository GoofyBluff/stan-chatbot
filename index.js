import express from "express";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate API Key
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Chatbot API is running!" });
});

// Chat route
app.post("/chat", async (req, res) => {
  const { user_id, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log(`🔥 [User ${user_id}] Message:`, message);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are Ava, a friendly and empathetic chatbot. Respond naturally to this user message: ${message}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Gemini API Raw Response:", response.data);

    const candidates = response.data.candidates;
    const botReply =
      candidates && candidates[0]?.content?.parts[0]?.text
        ? candidates[0].content.parts[0].text
        : "No response text found.";

    return res.json({ response: botReply });

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate response." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
