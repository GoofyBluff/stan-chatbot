import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    bot: { type: String, required: true }
}, { _id: false });

const memorySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    conversations: { type: [conversationSchema], default: [] },
    facts: {
        type: Map,
        of: String, // Example: { name: "Prashant", mood: "happy", hobbies: "reading" }
        default: {}
    }
}, { timestamps: true });

export default mongoose.model("Memory", memorySchema);
