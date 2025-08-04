# **Stan – Context-Aware AI Chatbot** 🤖  

Stan is a human-like conversational AI chatbot designed to demonstrate **empathy**, **context awareness**, **long-term memory**, and **personalization**. It uses **Google Gemini API**, **MongoDB** for persistent memory, and a **React-based UI with Tailwind CSS** for a smooth user experience.  

---

## ✅ **Features**
- **Human-like Conversations**  
  - Adapts tone based on user emotions (e.g., happy → cheerful, sad → empathetic)  
  - Avoids robotic replies and provides natural responses  

- **Personalized Memory**  
  - Remembers user details like name, mood, and preferences  
  - Handles contradictions gracefully (e.g., “Did I say my favorite food is pasta or pizza?”)  

- **Mood Detection & UI Adaptation**  
  - Changes chat header color and emoji based on user mood  
  - Smooth animations for better UX  

- **Fact Extraction**  
  - Auto-detects and stores facts (name, hobbies, preferences) using Regex + Gemini fallback  
  - Persists in **MongoDB Atlas** for long-term memory  

- **Hallucination Resistance**  
  - Never fabricates details; responds safely to vague or confusing queries  

---

## 🛠 **Tech Stack**
- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js + Express  
- **AI Model:** Google Gemini API (v1beta, model: gemini-1.5-flash)  
- **Database:** MongoDB Atlas  

---

## 📂 **Project Structure**



stan-chatbot/
│
├── backend/
│ ├── index.js # Main Express server
│ ├── services/
│ │ ├── gemini.js # Handles Gemini API requests
│ │ ├── memory.js # Memory logic (conversation + facts)
│ │ ├── extractFacts.js # Extracts name, mood, hobbies (Regex + Gemini fallback)
│ │ ├── nlp.js # Tone detection & analysis
│ │ ├── prompts.js # Base prompt templates for Gemini
│ │ └── db.js # MongoDB connection setup
│ └── models/
│ ├── User.js # Stores user facts, preferences
│ └── Memory.js # Stores conversation history
│
├── frontend/
│ ├── src/
│ │ ├── App.js # Main React component (chat UI)
│ │ ├── index.css # Tailwind + custom animations
│ │ └── components/ # (Optional) UI components
│ └── public/
│
└── README.md

yaml
Copy code

---

## ⚙️ Setup Instructions

### ✅ **1. Clone the Repository**
```bash
git clone https://github.com/YOUR-USERNAME/stan-chatbot.git
cd stan-chatbot
✅ 2. Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file inside backend/:

ini
Copy code
GEMINI_API_KEY=your_google_gemini_api_key
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
Run the backend:

bash
Copy code
npm start
✅ 3. Frontend Setup
bash
Copy code
cd ../frontend
npm install
Start the React app:

bash
Copy code
npm start
✅ 4. MongoDB Setup
Create a MongoDB Atlas cluster.

Copy the connection string and replace it in .env:

ini
Copy code
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stan-chatbot
✅ 5. Tailwind Setup in Frontend
Already configured in frontend/:

Installed tailwindcss, postcss, autoprefixer

Configured tailwind.config.js

Added custom animations for mood-based emoji bounce.