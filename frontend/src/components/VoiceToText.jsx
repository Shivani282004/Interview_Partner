import { useState, useEffect, useRef } from "react";

export default function VoiceToText({ onTranscriptReady, resetSignal }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const finalTextRef = useRef(""); // <CHANGE> Use ref to track final text

  // RESET when new question arrives
  useEffect(() => {
    setTranscript("");
    setIsRecording(false);
    finalTextRef.current = ""; // <CHANGE> Reset the ref too
  }, [resetSignal]);

  const createRecognitionInstance = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    return recognition;
  };

  const startRecording = () => {
    // ALWAYS reset text
    setTranscript("");
    finalTextRef.current = ""; // <CHANGE> Reset ref when starting new recording

    // CREATE A NEW INSTANCE EVERY TIME
    const recognition = createRecognitionInstance();
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTextRef.current += result[0].transcript + " "; // <CHANGE> Use ref instead of local variable
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(finalTextRef.current + interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    // ... existing code ...

    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const submitFinal = () => {
    onTranscriptReady(transcript);
    setTranscript(""); // <CHANGE> Clear transcript after submission
    finalTextRef.current = ""; // <CHANGE> Clear ref after submission
  };

  return (
  <div style={{ textAlign: "center", marginTop: "20px" }}>

    {/* Mic centered above text box */}
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
      {!isRecording ? (
        <button
          onClick={startRecording}
          style={{
            padding: "12px",
            background: "red",
            borderRadius: "50%",
            color: "white",
            fontSize: "22px",
            cursor: "pointer"
          }}
        >
          🎤
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            padding: "12px",
            background: "gray",
            borderRadius: "50%",
            color: "white",
            fontSize: "22px",
            cursor: "pointer"
          }}
        >
          ⏹
        </button>
      )}
    </div>

    <p style={{ marginTop: "3px", marginBottom: "10px" }}>Tap mic to start</p>

    {/* Text box */}
    <textarea
      value={transcript}
      readOnly
      style={{
        width: "350px",
        height: "120px",
        marginTop: "5px",
        padding: "10px",
        borderRadius: "10px",
        background: "#f0f0f0"
      }}
    ></textarea>

    <br />

    {/* Submit button */}
    <button
      onClick={submitFinal}
      style={{
        marginTop: "15px",
        padding: "10px 20px",
        background: "black",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      Submit Answer
    </button>
  </div>
);
}