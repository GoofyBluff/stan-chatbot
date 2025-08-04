/**
 * Analyze user message to detect tone, mood, or emotion.
 * Supports:
 * - Sadness (empathetic response)
 * - Happiness (cheerful response)
 * - Sarcasm
 * - Frustration
 * - Excitement
 *
 * @param {string} message - User input message
 * @returns {string} Tone instruction for Gemini
 */
export function detectTone(message) {
    const lowerMsg = message.toLowerCase();

    // Default tone
    let toneInstruction = "Respond in a friendly and helpful tone.";

    // Sadness detection
    if (lowerMsg.includes("sad") || lowerMsg.includes("upset") || lowerMsg.includes("depressed") || lowerMsg.includes("down")) {
        toneInstruction = "Respond in an empathetic and supportive tone. Offer comforting words.";
    }

    // Happiness detection
    else if (lowerMsg.includes("happy") || lowerMsg.includes("great") || lowerMsg.includes("awesome") || lowerMsg.includes("feeling good")) {
        toneInstruction = "Respond in an enthusiastic and cheerful tone. Be uplifting.";
    }

    // Frustration or anger detection
    else if (lowerMsg.includes("angry") || lowerMsg.includes("annoyed") || lowerMsg.includes("frustrated")) {
        toneInstruction = "Respond in a calm and understanding tone. Try to diffuse frustration.";
    }

    // Excitement detection
    else if (lowerMsg.includes("excited") || lowerMsg.includes("can't wait") || lowerMsg.includes("thrilled")) {
        toneInstruction = "Respond in an excited and enthusiastic tone. Match the energy.";
    }

    // Sarcasm detection (basic keywords)
    else if (lowerMsg.includes("yeah right") || lowerMsg.includes("sure") || lowerMsg.includes("as if")) {
        toneInstruction = "Respond in a witty and playful tone without being rude.";
    }

    return toneInstruction;
}
