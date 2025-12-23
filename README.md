Tech Stack

Frontend: React (Create React App, TypeScript)
Backend: Node.js, TypeScript, Express
Database: SQLite (via Prisma ORM)
LLM: Google Gemini (via @google/genai)
Other: Prisma, dotenv


🛠️ How to Run Locally (Step by Step)
1️⃣ Prerequisites
Node.js v20 LTS(imp)
npm
----------------------------------------------------------------------

2️⃣ Clone the repository
git clone <your-repo-url>
cd spur
----------------------------------------------------------------------

3️⃣ Backend Setup
cd backend
npm install
----------------------------------------------------------------------

4️⃣ Configure Environment Variables

Create a .env file in backend/ using the example:
cp .env.example .env
Update .env:
GEMINI_API_KEY=your_google_gemini_api_key
.env is ignored via .gitignore and never committed.

----------------------------------------------------------------------

5️⃣ Database Setup (Prisma)

Run migrations:

npm run prisma:generate
npm run prisma:migrate -- --name init


This will:

Create a local SQLite database

Create Conversation and Message tables

----------------------------------------------------------------------


6️⃣ Start Backend Server
npm run dev


Backend runs at:

http://localhost:3001

----------------------------------------------------------------------


7️⃣ Frontend Setup
cd ../react-ui
npm install
npm start


Frontend runs at:

http://localhost:3000

----------------------------------------------------------------------


💬 How the App Works

User opens the chat UI

User sends a message

Frontend calls POST /chat/message

Backend:

Creates or validates a conversation

Persists user and AI messages

Calls the LLM with conversation context

AI response is returned and shown in the UI

----------------------------------------------------------------------


🧱 Architecture Overview
Backend Structure

Routes
    Handle HTTP requests and responses

Services

    Core business logic
    Conversation lifecycle
    LLM integration

Database (Prisma)

    Conversations and messages persistence

This separation makes it easy to:

    Add new channels (WhatsApp, Instagram, Live Chat)
    Swap LLM providers
    Support human handoff in the future

----------------------------------------------------------------------


🧠 LLM Integration

Provider - Google Gemini

SDK - @google/genai

Model Used -gemini-2.5-flash

Prompting Strategy

    A system-style prompt defines the AI as a helpful e-commerce support agent
    Store policies (shipping, returns, support hours) are included
    Recent conversation history is passed on each request to maintain context

----------------------------------------------------------------------


⚠️ Error Handling & Robustness

    Empty or invalid messages are rejected
    LLM/API failures are caught on the backend
    Friendly error messages are returned
    UI displays clean fallback messages without crashing

----------------------------------------------------------------------


🔐 Environment & Security

    .env is excluded from git
    .env.example is committed
    No secrets are exposed in the repository

----------------------------------------------------------------------


🔁 Trade-offs & Design Decisions

    SQLite used for simplicity and fast local setup -(Postgres would be used in production)
    Session-based conversations instead of authentication
    No UI persistence on reload :
        Backend persistence is the primary focus per spec
        UI-side persistence can be added easily if needed

----------------------------------------------------------------------


⏳ If I Had More Time…

    Restore chat history on page reload
    Stream LLM responses
    Add retries and timeouts for LLM calls
    Redis caching for sessions
    Human agent handoff
    Analytics and conversation insights
    Production-ready Postgres setup

----------------------------------------------------------------------


✅ Status

    End-to-end chat works
    Conversations are persisted
    Real LLM integration
    Clean, extensible architecture

----------------------------------------------------------------------

