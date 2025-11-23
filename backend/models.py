from pydantic import BaseModel

class StartInterviewRequest(BaseModel):
    role: str

class StartInterviewResponse(BaseModel):
    session_id: str
    question: str
