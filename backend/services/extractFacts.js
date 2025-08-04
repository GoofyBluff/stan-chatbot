import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Extract structured facts from user message using regex first,
 * then fallback to Gemini if message is complex.
 * @param {string} message
 * @returns {Promise<object>} Facts object (e.g., { name: "Prashant", mood: "happy" })
 */
export async function extractFacts(message) {
    const facts = {};

    // ✅ Regex-based detection for common patterns
    const lowerMsg = message.toLowerCase();

    // Name extraction
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
        facts.name = nameMatch[1];
    }

    // Favorite food
    const foodMatch = message.match(/my favorite food is (\w+)/i);
    if (foodMatch) {
        facts.favoriteFood = foodMatch[1];
    }

    // Mood detection
    if (lowerMsg.includes("i am sad") || lowerMsg.includes("i'm sad") || lowerMsg.includes("feeling down")) {
        facts.mood = "sad";
    } else if (lowerMsg.includes("i am happy") || lowerMsg.includes("i'm happy") || lowerMsg.includes("feeling great")) {
        facts.mood = "happy";
    }

    // Hobbies
    const hobbyMatch = message.match(/i like (.+)/i);
    if (hobbyMatch) {
        facts.hobbies = hobbyMatch[1].split(",").map(h => h.trim());
    }

    // ✅ If regex found some facts, return immediately
    if (Object.keys(facts).length > 0) {
        return facts;
    }

    // ✅ Gemini Fallback for complex sentences
    try {
        const prompt = `
        Extract structured user facts from the following text:
        "${message}"

        Return as a JSON object with possible keys:
        name, mood, hobbies, favoriteFood, personality.
        Do not add extra text, only JSON.
        `;

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
            const jsonText = data.candidates[0].content.parts[0].text.trim();

            // Try parsing JSON response safely
            try {
                const parsedFacts = JSON.parse(jsonText);
                return parsedFacts;
            } catch {
                console.error("❌ Gemini response is not valid JSON:", jsonText);
            }
        }
    } catch (error) {
        console.error("❌ Error in Gemini fallback fact extraction:", error.message);
    }

    return {}; // Return empty if no facts found
}
