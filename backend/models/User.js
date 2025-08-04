import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Unique user identifier
    name: { type: String, default: null },
    mood: { type: String, default: "neutral" }, // e.g., happy, sad, excited
    hobbies: { type: [String], default: [] },
    personality: { type: String, default: null }, // e.g., friendly, calm
    preferences: { type: Map, of: String, default: {} }, // e.g., { favoriteFood: "pizza" }
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
