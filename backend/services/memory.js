import Memory from "../models/Memory.js";

/**
 * Update user's conversation memory in MongoDB
 */
export async function updateMemory(userId, userMessage, botResponse) {
    try {
        let userMemory = await Memory.findOne({ userId });

        if (!userMemory) {
            userMemory = new Memory({
                userId,
                conversations: [],
                facts: {}
            });
        }

        if (!Array.isArray(userMemory.conversations)) {
            userMemory.conversations = [];
        }

        userMemory.conversations.push({ user: userMessage, bot: botResponse });

        // Keep only the last 5 messages
        if (userMemory.conversations.length > 5) {
            userMemory.conversations = userMemory.conversations.slice(-5);
        }

        await userMemory.save();
    } catch (error) {
        console.error("❌ Error updating memory:", error.message);
    }
}

/**
 * Get summarized memory for context
 */
export async function getMemorySummary(userId) {
    try {
        const userMemory = await Memory.findOne({ userId });

        if (!userMemory || !Array.isArray(userMemory.conversations) || userMemory.conversations.length === 0) {
            return "No prior context.";
        }

        return userMemory.conversations
            .map(msg => `User: ${msg.user} | Bot: ${msg.bot}`)
            .join("\n");
    } catch (error) {
        console.error("❌ Error fetching memory summary:", error.message);
        return "No prior context.";
    }
}

/**
 * Get extracted facts from user profile
 */
export async function getFacts(userId) {
    try {
        const userMemory = await Memory.findOne({ userId });

        if (!userMemory || !userMemory.facts || Object.keys(userMemory.facts).length === 0) {
            return "No known facts about the user.";
        }

        return Object.entries(userMemory.facts)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
    } catch (error) {
        console.error("❌ Error fetching user facts:", error.message);
        return "No known facts about the user.";
    }
}

/**
 * Update or add facts in user's profile
 */
export async function updateFacts(userId, newFacts) {
    try {
        let userMemory = await Memory.findOne({ userId });

        if (!userMemory) {
            userMemory = new Memory({
                userId,
                conversations: [],
                facts: {}
            });
        }

        userMemory.facts = { ...userMemory.facts, ...newFacts };

        await userMemory.save();
    } catch (error) {
        console.error("❌ Error updating facts:", error.message);
    }
}
