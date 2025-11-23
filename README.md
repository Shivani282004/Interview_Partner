📌 Interview Partner – AI-Powered Mock Interview System

An intelligent mock interview platform built using:

FastAPI Backend

React + Vite Frontend

Local Phi-3 Mini 4K Instruct (GGUF) as the LLM

Speech-to-Text voice input

Dynamic question generation

AI-generated interview summary + feedback

This app simulates a customized interview experience for different roles and provides structured feedback at the end.

🚀 Features
🎤 Voice-Powered Interview

Real-time speech-to-text (browser microphone)

Auto-transcribed answers

🤖 AI-Driven Question Generator

Uses Phi-3 Mini GGUF model locally

Generates contextual follow-up questions

Avoids repeating previous questions

Fully offline — no API key needed

🧠 Smart Feedback Report

At the end of the interview:

Overall feedback

Communication skill assessment

Technical understanding

Strengths

Areas for improvement

🗂 Multiple User Personas

Select any role:

Software Engineer

Backend Developer

Data Scientist

React Developer

And more…

🖥 Full-stack Architecture

FastAPI backend exposes secure APIs

React frontend manages UI and session state

📂 Project Structure
interview-partner/
│── backend/
│   ├── llm/
│   │   ├── load_llm.py
│   │   └── interview_agent.py
│   ├── models/
│   │   └── Phi-3-mini-4k-instruct-q4.gguf
│   ├── main.py
│   ├── session_store.py
│   ├── requirements.txt
│   └── .env
│
│── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   |
│   │   └── components/...
│   ├── index.html
│   └── package.json
│
└── README.md

⚙️ Backend Setup (FastAPI + Local Phi Mini)
1️⃣ Navigate to backend
cd backend

2️⃣ Create virtual environment
python -m venv venv

3️⃣ Activate environment

Windows

venv\Scripts\activate


macOS/Linux

source venv/bin/activate

4️⃣ Install dependencies
pip install -r requirements.txt

5️⃣ Place your LLM model (very important)

Model must exist here:

backend/models/Phi-3-mini-4k-instruct-q4.gguf

6️⃣ Run backend
uvicorn main:app --reload


Backend runs at:

👉 http://localhost:8000

🎨 Frontend Setup (React + Vite)
1️⃣ Navigate to frontend
cd frontend

2️⃣ Install dependencies
npm install

3️⃣ Start frontend
npm run dev


Frontend runs at:

👉 http://localhost:5173

🏛 System Architecture Overview
1. User Interface (React + Vite)

Handles role selection, question display, and voice input.

Uses Web Speech API for speech-to-text.

Communicates with backend using REST endpoints.

2. Backend Logic (FastAPI)

Routes:

Endpoint	Purpose
/start-interview	Creates session and sends first question
/next-question	AI generates next interview question
/submit-answer	Stores answer
/quit-interview	Generates AI feedback summary
3. LLM Engine (Phi-3 Mini GGUF)

Loaded locally using llama_cpp_python

All inference is done offline

Generates interview questions & end summary

4. Session Manager

Sessions stored in memory

Tracks conversation context

Prevents repeated questions

🧩 Design Decisions
✔ Local LLM over Cloud API

No cost

No rate limits

Completely private

Faster inference on CPU

✔ FastAPI for Backend

Lightweight and async

Perfect for LLM-driven workloads

Easy to integrate with frontend

✔ Custom Agent Instead of LangChain

Avoids overhead & complexity

Full control over prompts

Faster local execution

✔ Voice-to-Text on Client Side

Zero backend load

No external API required

Works on all Chromium browsers


