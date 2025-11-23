import { useState } from "react";
import RoleSelectorCard from "./components/RoleSelectorCard";
import VoiceToText from "./components/VoiceToText";

function App() {
  const [role, setRole] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  
  const [interviewActive, setInterviewActive] = useState(false);
  const [quitData, setQuitData] = useState(null);

  
  const startInterview = async () => {
    if (!role) {
      alert("Please choose a role");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    const res = await fetch(`${backendUrl}/start-interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    setSessionId(data.session_id);
    setCurrentQuestion(data.question);
    setInterviewActive(true);

    
    setResetSignal((prev) => prev + 1);
  };


  const onTranscriptReady = async (answer) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

   
    await fetch(`${backendUrl}/submit-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answer }),
    });

    
    const res = await fetch(`${backendUrl}/next-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answer }),
    });

    const data = await res.json();

    if (data.interview_ended) return;

    setCurrentQuestion(data.next_question);
    setResetSignal((prev) => prev + 1); 
  };

  
  const handleQuit = (data) => {
    setQuitData(data);
    setInterviewActive(false);
  };

  
if (quitData) {
  return (
    <div style={{ padding: "30px" }}>
      <h2>Interview Feedback</h2>

      <p><strong>Overall:</strong> {quitData.feedback}</p>
      <p><strong>Communication:</strong> {quitData.communication_skills}</p>
      <p><strong>Technical:</strong> {quitData.technical_knowledge}</p>
      <p><strong>Areas to Improve:</strong> {quitData.areas_for_improvement}</p>
      <p><strong>Strengths:</strong> {quitData.strengths}</p>

      <button onClick={() => window.location.reload()}>
        Restart Interview
      </button>
    </div>
  );
}



 
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      {!interviewActive ? (
        <RoleSelectorCard role={role} setRole={setRole} startInterview={startInterview} />
      ) : (
        <div style={{ textAlign: "center" }}>
          <VoiceToText
            onTranscriptReady={onTranscriptReady}
            resetSignal={resetSignal}
            sessionId={sessionId}
            currentQuestion={currentQuestion}
            onQuit={handleQuit}
          />
        </div>
      )}
    </div>
  );
}

export default App;
