import { useState } from "react";
import RoleSelectorCard from "./components/RoleSelectorCard";
import VoiceToText from "./components/VoiceToText";

function App() {
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [interviewActive, setInterviewActive] = useState(false);

  // 1. Start Interview
  const startInterview = async () => {
    if (!role) {
      alert("Please choose a role");
      return;
    }

    const res = await fetch("http://localhost:8000/start-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });

    const data = await res.json();
    setQuestion(data.question);
    setSessionId(data.session_id);
    setInterviewActive(true);
  };

  // 2. Handle transcript and get next question
  const onTranscriptReady = async (text) => {

    // Step 2.1 — Store answer
    await fetch("http://localhost:8000/submit-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        answer: text
      })
    });

    setSavedMessage("Answer saved ✔");

    // Step 2.2 — Call next-question
    const nextRes = await fetch("http://localhost:8000/next-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        answer: text
      })
    });

    const nextData = await nextRes.json();
    setQuestion(nextData.next_question);  // Update with new question
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
      padding: "20px"
    }}>

      {!interviewActive ? (
        <RoleSelectorCard
          role={role}
          setRole={setRole}
          startInterview={startInterview}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1>{question}</h1>
          <VoiceToText onTranscriptReady={onTranscriptReady} />

          {savedMessage && (
            <p style={{ color: "green", marginTop: "20px", fontSize: "18px" }}>
              {savedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
