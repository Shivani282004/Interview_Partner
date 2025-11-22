import { useState, useEffect, useRef } from "react";

export default function VoiceToText({ onTranscriptReady }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = () => {
      alert("Error capturing audio. Please try again.");
      setIsRecording(false);
    };
  }, []);

  const startRecording = () => {
    setTranscript("");
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current.stop();
  };

  const submitFinal = () => {
    onTranscriptReady(transcript); 
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {!isRecording ? (
        <button
          onClick={startRecording}
          style={{
            padding: "12px 20px",
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
            padding: "12px 20px",
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

      <p style={{ marginTop: "10px" }}>
        {isRecording ? "Listening..." : "Tap mic to start recording"}
      </p>

      <textarea
        value={transcript}
        readOnly
        style={{
          width: "350px",
          height: "120px",
          marginTop: "15px",
          padding: "10px",
          borderRadius: "10px",
          background: "#f0f0f0",
          fontSize: "15px"
        }}
      ></textarea>

      <br />

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
