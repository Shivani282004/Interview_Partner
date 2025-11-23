import { useState, useEffect, useRef } from "react"

export default function VoiceToText({ onTranscriptReady, resetSignal, onQuit, sessionId, currentQuestion }) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recognitionRef = useRef(null)
  const finalTextRef = useRef("")
  const lastProcessedIndexRef = useRef(-1)

  useEffect(() => {
    setTranscript("")
    setIsRecording(false)
    setIsSubmitting(false)
    finalTextRef.current = ""
    lastProcessedIndexRef.current = -1
  }, [resetSignal])

  const createRecognitionInstance = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!")
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    return recognition
  }

  const startRecording = () => {
    setTranscript("")
    finalTextRef.current = ""
    lastProcessedIndexRef.current = -1

    const recognition = createRecognitionInstance()
    if (!recognition) return

    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      let interim = ""

      for (let i = lastProcessedIndexRef.current + 1; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTextRef.current += result[0].transcript + " "
          lastProcessedIndexRef.current = i
        }
      }

      for (let i = event.results.length - 1; i > lastProcessedIndexRef.current; i--) {
        const result = event.results[i]
        if (!result.isFinal) {
          interim = result[0].transcript
          break
        }
      }

      setTranscript(finalTextRef.current + interim)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const submitFinal = async () => {
    if (!transcript.trim()) return
    setIsSubmitting(true)
    try {
      await onTranscriptReady(transcript)
    } finally {
      setIsSubmitting(false)
      setTranscript("")
      finalTextRef.current = ""
    }
  }

  
  const handleQuit = async () => {
    if (confirm("Are you sure you want to quit the interview?")) {
      if (!sessionId) {
        console.error("Missing session ID for quit request")
        return
      }

      setIsSubmitting(true)

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

        const response = await fetch(`${backendUrl}/quit-interview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const text = await response.text()
        const data = text ? JSON.parse(text) : {}

        if (onQuit) {
          onQuit(data)
        }
      } catch (error) {
        console.error("Error quitting interview:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {currentQuestion && (
        <div
          style={{
            width: "350px",
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#f9f9f9",
            border: "2px solid #333",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#333" }}>Question:</h3>
          <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.5" }}>{currentQuestion}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isSubmitting}
            style={{
              padding: "12px",
              background: isSubmitting ? "#ccc" : "red",
              borderRadius: "50%",
              color: "white",
              fontSize: "22px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            🎤
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={isSubmitting}
            style={{
              padding: "12px",
              background: "gray",
              borderRadius: "50%",
              color: "white",
              fontSize: "22px",
              cursor: "pointer",
              border: "none",
            }}
          >
            ⏹
          </button>
        )}
      </div>

      <p style={{ marginTop: "3px", marginBottom: "10px" }}>
        {isRecording ? "Recording..." : "Tap mic to start"}
      </p>

      <textarea
        value={transcript}
        readOnly
        style={{
          width: "350px",
          height: "120px",
          marginTop: "5px",
          padding: "10px",
          borderRadius: "10px",
          background: "#f0f0f0",
          border: "1px solid #ccc",
          fontFamily: "Arial, sans-serif",
        }}
      ></textarea>

      <br />

      <button
        onClick={submitFinal}
        disabled={!transcript.trim() || isSubmitting}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: !transcript.trim() || isSubmitting ? "#999" : "black",
          color: "white",
          borderRadius: "8px",
          cursor: !transcript.trim() || isSubmitting ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        {isSubmitting ? "Processing..." : "Submit Answer"}
      </button>

      <button
        onClick={handleQuit}
        style={{
          marginTop: "15px",
          marginLeft: "10px",
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          border: "none",
        }}
      >
        Quit Interview
      </button>
    </div>
  )
}
