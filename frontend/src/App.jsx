import { useState } from "react";
import RoleSelectorCard from "./components/RoleSelectorCard";
import VoiceToText from "./components/VoiceToText";

function App() {
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState("");

  const startInterview = async () => {
    const res = await fetch("http://localhost:8000/start-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });

    const data = await res.json();
    setQuestion(data.question);
    setSessionId(data.session_id);
  };

  const onTranscriptReady = async (text) => {
    const res = await fetch("http://localhost:8000/submit-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        answer: text
      })
    });

    const data = await res.json();
    alert("Answer saved!");
    console.log("Stored Answer:", data);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>

      {!question ? (
        <RoleSelectorCard
          role={role}
          setRole={setRole}
          startInterview={startInterview}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1>{question}</h1>
          <VoiceToText onTranscriptReady={onTranscriptReady} />
        </div>
      )}

    </div>
  );
}

export default App;
