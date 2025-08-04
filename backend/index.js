import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { generateGeminiResponse } from "./services/gemini.js";
import { updateMemory, getMemorySummary } from "./services/memory.js";
import { extractFacts } from "./services/extractFacts.js";
import User from "./models/User.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Root route
app.get("/", (req, res) => {
    res.send("✅ Stan Chatbot API is running...");
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
    const { user_id, message } = req.body;
    console.log(`🔥 Received message from ${user_id}: ${message}`);

    if (!user_id || !message) {
        return res.status(400).json({ error: "user_id and message are required." });
    }

    try {
        // ✅ Get or create user in DB
        let user = await User.findOne({ userId: user_id });
        if (!user) {
            user = await User.create({ userId: user_id, facts: {}, mood: "neutral" });
        }

        // ✅ Extract facts & update user profile
        const newFacts = await extractFacts(message);
        if (Object.keys(newFacts).length > 0) {
            user.facts = { ...user.facts, ...newFacts };
            if (newFacts.mood) user.mood = newFacts.mood;
            await user.save();
        }

        // ✅ Get memory summary from DB
        const memorySummary = await getMemorySummary(user_id);
        const factsSummary = JSON.stringify(user.facts);

        // ✅ Generate response using Gemini
        const botResponse = await generateGeminiResponse(user_id, message, memorySummary, factsSummary, user.mood);

        // ✅ Update conversation memory in DB
        await updateMemory(user_id, message, botResponse);

        res.json({
            response: botResponse,
            mood: user.mood,
            facts: user.facts
        });
    } catch (error) {
        console.error("❌ Error in /chat route:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
