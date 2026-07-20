import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: "none",
    padding: "8px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: location.pathname === path ? "#fff" : "#888",
    background: location.pathname === path ? "#2a2a3a" : "transparent",
    border: location.pathname === path
      ? "0.5px solid #444" : "0.5px solid transparent",
  });

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      borderBottom: "0.5px solid #222",
      background: "#0d0d1a",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px" }}>🧠</span>
        <span style={{ fontWeight: 500, fontSize: "18px", color: "#fff" }}>
          MindSync
        </span>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Link to="/"          style={linkStyle("/")}>
          Live Session
        </Link>
        <Link to="/analytics" style={linkStyle("/analytics")}>
          Analytics
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d1a",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
    }}>
      <Navbar />
      <div style={{ padding: "24px" }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}