from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from session_store import sessions
from models import StartInterviewRequest, StartInterviewResponse

from llm.load_llm import load_llm
from llm.interview_agent import create_interview_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

FIRST_QUESTION = "Tell me about yourself."


def extract_question(response_text):
    """Extract only the question from the agent response"""
    text = response_text.strip()
    
    
    labels = [
        "Ask the next interview question:",
        "Generate the next interview question:",
        "Next question:",
        "Solution:",
        "Question:"
    ]
    
    for label in labels:
        if label.lower() in text.lower():
            
            idx = text.lower().find(label.lower())
            text = text[idx + len(label):].strip()
    
    
    text = text.replace("**", "").strip()
    
    
    if "?" in text:
        first_question = text.split("?")[0].strip() + "?"
        return first_question
    
    return text if text else "Can you tell me more about your experience?"



@app.post("/start-interview", response_model=StartInterviewResponse)
async def start_interview(data: StartInterviewRequest):
    import uuid

    session_id = str(uuid.uuid4())

    llm = load_llm()
    agent = create_interview_agent(llm, data.role)

    sessions[session_id] = {
        "role": data.role,
        "agent": agent,
        "history": [],
        "question_count": 0,
        "is_active": True
    }

    return StartInterviewResponse(
        session_id=session_id,
        question=FIRST_QUESTION
    )



@app.post("/submit-answer")
async def submit_answer(data: dict):
    return {"status": "saved"}



@app.post("/next-question")
async def next_question(data: dict):
    session_id = data.get("session_id")
    answer = data.get("answer")

    if session_id not in sessions:
        return {"error": "Invalid session_id. Start a new interview."}

    session = sessions[session_id]
    
    if not session.get("is_active", True):
        return {"error": "Interview has been quit.", "interview_ended": True}

    agent = session["agent"]

    try:
        response = agent(
            {"answer": answer, "role": session["role"]}
        )
        raw_response = response.get("text", "").strip()
        
        next_q = extract_question(raw_response)
        
        if not next_q:
            next_q = "Thank you for that answer. Can you tell me more about your experience?"
    except Exception as e:
        print(f"Error generating question: {e}")
        next_q = "Thank you for that answer. Can you tell me more about your experience?"

    session["question_count"] += 1
    session["history"].append({
        "question": session.get("last_question", FIRST_QUESTION),
        "answer": answer
    })

    session["last_question"] = next_q

    return {"next_question": next_q}


@app.post("/quit-interview")
async def quit_interview(data: dict):
    session_id = data.get("session_id")
    
    if not session_id:
        return {"error": "Missing session_id in request"}

    if session_id not in sessions:
        return {"error": "Invalid session_id."}

    session = sessions[session_id]
    session["is_active"] = False

    llm = load_llm()
    history = session.get("history", [])
    
    if history:
        
        conversation = "\n".join([
            f"Q: {item['question']}\nA: {item['answer']}" 
            for item in history
        ])
        
        
        feedback_prompt = f"""Based on the following interview conversation, provide detailed post-interview feedback. 
        
Interview Conversation:
{conversation}

Please provide feedback in this exact format:
OVERALL_FEEDBACK: [2-3 sentences of overall assessment]
COMMUNICATION_SKILLS: [Assessment of communication quality]
TECHNICAL_KNOWLEDGE: [Assessment of technical understanding]
AREAS_FOR_IMPROVEMENT: [List 3-4 specific areas to improve]
STRENGTHS: [List 3-4 key strengths shown]"""

        try:
            feedback_text = llm.invoke(feedback_prompt)
            
            
            feedback_dict = {}
            for section in ["OVERALL_FEEDBACK", "COMMUNICATION_SKILLS", "TECHNICAL_KNOWLEDGE", "AREAS_FOR_IMPROVEMENT", "STRENGTHS"]:
                if section in feedback_text:
                    start = feedback_text.find(section + ":") + len(section) + 1
                    end = feedback_text.find("\n", start)
                    if end == -1:
                        end = len(feedback_text)
                    feedback_dict[section] = feedback_text[start:end].strip()
        except:
            feedback_dict = {
                "OVERALL_FEEDBACK": "Interview completed successfully.",
                "COMMUNICATION_SKILLS": "Good communication demonstrated.",
                "TECHNICAL_KNOWLEDGE": "Solid technical understanding shown.",
                "AREAS_FOR_IMPROVEMENT": "Continue learning and practicing.",
                "STRENGTHS": "Strong problem-solving and articulation skills."
            }
    else:
        feedback_dict = {
            "OVERALL_FEEDBACK": "Interview completed.",
            "COMMUNICATION_SKILLS": "N/A",
            "TECHNICAL_KNOWLEDGE": "N/A",
            "AREAS_FOR_IMPROVEMENT": "N/A",
            "STRENGTHS": "N/A"
        }

    return {
        "status": "Interview ended",
        "total_questions": session["question_count"],
        "summary": session["history"],
        "feedback": feedback_dict.get("OVERALL_FEEDBACK", ""),
        "communication_skills": feedback_dict.get("COMMUNICATION_SKILLS", ""),
        "technical_knowledge": feedback_dict.get("TECHNICAL_KNOWLEDGE", ""),
        "areas_for_improvement": feedback_dict.get("AREAS_FOR_IMPROVEMENT", ""),
        "strengths": feedback_dict.get("STRENGTHS", "")
    }
