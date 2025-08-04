import fetch from "node-fetch";
import dotenv from "dotenv";
import { BASE_PROMPT } from "../utils/prompts.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generate a conversational response using Gemini API
 * @param {string} userId - Unique user identifier
 * @param {string} userMessage - Latest user message
 * @param {string} memorySummary - Summary of recent conversation history
 * @param {string} facts - Known facts about the user (e.g., preferences)
 * @param {string} mood - User's current mood
 * @returns {Promise<string>} - The chatbot response
 */
export async function generateGeminiResponse(userId, userMessage, memorySummary, facts, mood) {
    console.log("✅ Inside generateGeminiResponse()");

    // Detect tone from message & mood
    let toneInstruction = "Respond in a friendly and helpful tone.";
    const lowerMsg = userMessage.toLowerCase();

    if (mood === "happy" || lowerMsg.includes("happy") || lowerMsg.includes("great") || lowerMsg.includes("excited")) {
        toneInstruction = "Respond in an enthusiastic and cheerful tone.";
    } else if (mood === "sad" || lowerMsg.includes("sad") || lowerMsg.includes("upset") || lowerMsg.includes("depressed")) {
        toneInstruction = "Respond in an empathetic and supportive tone.";
    } else if (lowerMsg.includes("angry") || lowerMsg.includes("frustrated")) {
        toneInstruction = "Respond calmly and try to ease the frustration.";
    } else if (lowerMsg.includes("sarcastic") || lowerMsg.includes("funny")) {
        toneInstruction = "Respond with a witty but kind tone.";
    }

    // Prepare final prompt using BASE_PROMPT template
    const prompt = BASE_PROMPT
        .replace("{memory}", memorySummary)
        .replace("{facts}", facts)
        .replace("{tone}", toneInstruction)
        .replace("{message}", userMessage);

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            console.error("❌ Gemini API response error:", data);
            return "Hmm, I couldn't think of a good reply. Can you try again?";
        }
    } catch (error) {
        console.error("❌ Error calling Gemini API:", error.message);
        return "Something went wrong while generating a response.";
    }
}
