from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from session_store import sessions
from models import StartInterviewRequest, StartInterviewResponse
from intelligence.nlp_engine import get_next_question

app = FastAPI()   # ✅ MUST COME BEFORE ANY ROUTES

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

FIRST_QUESTION = "Tell me about yourself."


# ---------------------------
# START INTERVIEW ENDPOINT
# ---------------------------
@app.post("/start-interview", response_model=StartInterviewResponse)
async def start_interview(data: StartInterviewRequest):
    import uuid

    session_id = str(uuid.uuid4())
    role = data.role

    sessions[session_id] = {
        "role": role,
        "history": [],
        "first_answer": None
    }

    return StartInterviewResponse(
        session_id=session_id,
        question=FIRST_QUESTION
    )


# ---------------------------
# STORE ANSWER ENDPOINT
# ---------------------------
@app.post("/submit-answer")
async def submit_answer(data: dict):
    session_id = data["session_id"]
    answer = data["answer"]

    sessions[session_id]["first_answer"] = answer
    sessions[session_id]["history"].append({
        "question": FIRST_QUESTION,
        "answer": answer
    })

    return {"status": "saved"}


# ---------------------------
# NEXT QUESTION ENDPOINT
# ---------------------------
@app.post("/next-question")
async def next_question(data: dict):
    session_id = data["session_id"]
    answer = data["answer"]

    role = sessions[session_id]["role"]

    result = get_next_question(role, answer)

    sessions[session_id]["history"].append({
        "question": FIRST_QUESTION,
        "answer": answer,
        "analysis": result
    })

    return {
        "next_question": result["next_question"]
    }
