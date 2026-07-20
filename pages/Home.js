import { useState, useEffect } from "react";
import axios from "axios";

const STATE_COLORS = {
  Focused:     { bg: "#1a3a1a", border: "#00ff88", text: "#00ff88" },
  Distracted:  { bg: "#3a2a1a", border: "#ff9900", text: "#ff9900" },
  Fatigued:    { bg: "#3a1a1a", border: "#ff4444", text: "#ff4444" },
  Confused:    { bg: "#2a1a3a", border: "#cc44ff", text: "#cc44ff" },
  Initializing:{ bg: "#1a1a2a", border: "#4444ff", text: "#4444ff" },
  "No Face":   { bg: "#2a2a2a", border: "#888888", text: "#888888" },
};

const STATE_ICONS = {
  Focused:      "😊",
  Distracted:   "😵",
  Fatigued:     "😴",
  Confused:     "😕",
  Initializing: "⏳",
  "No Face":    "👤",
};

const CONTENT = {
  Focused: {
    title:  "Advanced Topic: Neural Networks",
    body:   "You're focused! Let's tackle something challenging. A neural network consists of layers of interconnected nodes. Each connection has a weight that gets adjusted during training via backpropagation.",
    action: "Try the advanced quiz →",
  },
  Distracted: {
    title:  "👋 Hey, come back!",
    body:   "It looks like your attention has drifted. Let's refocus. Take a deep breath and look at the screen. We'll start with something simple to get back on track.",
    action: "Resume from where you left off →",
  },
  Fatigued: {
    title:  "😴 Time for a Break",
    body:   "You've been studying hard! Research shows that short breaks improve retention. Step away for 5 minutes, stretch, and grab some water before continuing.",
    action: "Start 5-minute break timer →",
  },
  Confused: {
    title:  "Let's Simplify This",
    body:   "No worries — this topic can be tricky. Let's go back to basics. Think of a neural network like a series of decisions, each one building on the last, just like how you'd solve a maze step by step.",
    action: "Watch a visual explanation →",
  },
  Initializing: {
    title:  "Starting MindSync...",
    body:   "Initializing the cognitive detection system. Please make sure your face is visible to the webcam and you are in a well-lit environment.",
    action: "",
  },
  "No Face": {
    title:  "No Face Detected",
    body:   "Please position yourself in front of the webcam. Make sure the lighting is good and your face is clearly visible.",
    action: "",
  },
};

function MetricCard({ label, value, unit }) {
  return (
    <div style={{
      background: "#1e1e2e",
      border: "0.5px solid #444",
      borderRadius: "8px",
      padding: "12px 16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 500, color: "#fff" }}>
        {value}
        <span style={{ fontSize: "12px", color: "#888" }}> {unit}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [data,  setData]  = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/state");
        setData(res.data);
        setError(false);
      } catch {
        setError(true);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  const state   = data?.state  || "Initializing";
  const colors  = STATE_COLORS[state] || STATE_COLORS.Initializing;
  const content = CONTENT[state]      || CONTENT.Initializing;

  return (
    <div>
      {/* Live indicator */}
      <div style={{ display: "flex", justifyContent: "flex-end",
                    marginBottom: "16px" }}>
        <div style={{
          fontSize: "12px",
          color: error ? "#ff4444" : "#00ff88",
          background: error ? "#3a1a1a" : "#1a3a1a",
          padding: "6px 12px",
          borderRadius: "20px",
          border: `0.5px solid ${error ? "#ff4444" : "#00ff88"}`,
        }}>
          {error ? "⚠ Backend offline" : "● Live"}
        </div>
      </div>

      {/* State Card */}
      <div style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        textAlign: "center",
        transition: "all 0.5s ease",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>
          {STATE_ICONS[state]}
        </div>
        <div style={{
          fontSize: "32px", fontWeight: 500,
          color: colors.text, marginBottom: "4px",
        }}>
          {state}
        </div>
        {data?.recommendation && (
          <div style={{
            fontSize: "14px", color: "#ccc",
            marginTop: "8px", padding: "8px 16px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "8px", display: "inline-block",
          }}>
            {data.recommendation.message}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px", marginBottom: "20px",
      }}>
        <MetricCard label="EAR"
          value={data?.ear           ?? "—"} unit="" />
        <MetricCard label="Blinks (5s)"
          value={data?.recent_blinks ?? "—"} unit="" />
        <MetricCard label="Pitch adj"
          value={data?.pitch_adj     ?? "—"} unit="°" />
        <MetricCard label="Yaw adj"
          value={data?.yaw_adj       ?? "—"} unit="°" />
      </div>

      {/* Content Area */}
      <div style={{
        background: "#1e1e2e", border: "0.5px solid #333",
        borderRadius: "12px", padding: "24px",
      }}>
        <h2 style={{
          margin: "0 0 12px", fontSize: "18px",
          fontWeight: 500, color: colors.text,
        }}>
          {content.title}
        </h2>
        <p style={{
          margin: "0 0 16px", fontSize: "15px",
          color: "#ccc", lineHeight: 1.7,
        }}>
          {content.body}
        </p>
        {content.action && (
          <button style={{
            background: "transparent",
            border: `0.5px solid ${colors.border}`,
            color: colors.text, padding: "10px 20px",
            borderRadius: "8px", cursor: "pointer",
            fontSize: "14px",
          }}>
            {content.action}
          </button>
        )}
      </div>
    </div>
  );
}