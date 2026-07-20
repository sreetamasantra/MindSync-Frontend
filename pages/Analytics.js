import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from "recharts";

const STATE_COLORS_MAP = {
  Focused:    "#00ff88",
  Distracted: "#ff9900",
  Fatigued:   "#ff4444",
  Confused:   "#cc44ff",
};

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#1e1e2e",
      border: "0.5px solid #333",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: 500, color: color || "#fff" }}>
        {value}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [log,      setLog]      = useState([]);
  const [trend,    setTrend]    = useState([]);
  const [summary,  setSummary]  = useState({});
  const [error,    setError]    = useState(false);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/session/log");
        const entries = res.data.log || [];
        setLog(entries);

        // Build trend data
        const trendData = entries.map((entry, i) => ({
          index: i + 1,
          state: entry.state,
          value: ["Focused", "Confused", "Distracted", "Fatigued"]
                   .indexOf(entry.state),
        }));
        setTrend(trendData);

        // Build summary
        const counts = { Focused: 0, Distracted: 0,
                         Fatigued: 0, Confused: 0 };
        entries.forEach(e => {
          if (counts[e.state] !== undefined) counts[e.state]++;
        });
        setSummary(counts);
        setError(false);
      } catch {
        setError(true);
      }
    };

    fetchLog();
    const interval = setInterval(fetchLog, 3000);
    return () => clearInterval(interval);
  }, []);

  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(summary)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const resetSession = async () => {
    await axios.post("http://localhost:5000/api/session/reset");
    setLog([]);
    setTrend([]);
    setSummary({});
  };

  return (
    <div>
      {/* Header row */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px",
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>
            Session Analytics
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
            {total} events recorded this session
          </p>
        </div>
        <button onClick={resetSession} style={{
          background: "transparent",
          border: "0.5px solid #ff4444",
          color: "#ff4444", padding: "8px 16px",
          borderRadius: "8px", cursor: "pointer",
          fontSize: "13px",
        }}>
          Reset Session
        </button>
      </div>

      {error && (
        <div style={{ color: "#ff4444", marginBottom: "16px",
                      fontSize: "14px" }}>
          ⚠ Cannot connect to backend
        </div>
      )}

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px", marginBottom: "24px",
      }}>
        <StatCard label="Focused"
          value={summary.Focused    || 0}
          color="#00ff88" />
        <StatCard label="Distracted"
          value={summary.Distracted || 0}
          color="#ff9900" />
        <StatCard label="Fatigued"
          value={summary.Fatigued   || 0}
          color="#ff4444" />
        <StatCard label="Confused"
          value={summary.Confused   || 0}
          color="#cc44ff" />
      </div>

      {/* Charts Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "16px", marginBottom: "24px",
      }}>
        {/* Trend Chart */}
        <div style={{
          background: "#1e1e2e", border: "0.5px solid #333",
          borderRadius: "12px", padding: "20px",
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px",
                       fontWeight: 500, color: "#ccc" }}>
            Attention Trend
          </h3>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="index" stroke="#555"
                       tick={{ fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }}
                  tickFormatter={v =>
                    ["Focused","Confused","Distracted","Fatigued"][v] || ""}
                  domain={[0, 3]} ticks={[0,1,2,3]} />
                <Tooltip
                  contentStyle={{ background: "#1e1e2e",
                                  border: "0.5px solid #444",
                                  fontSize: "12px" }}
                  formatter={(v) =>
                    ["Focused","Confused","Distracted","Fatigued"][v]}
                />
                <Line type="stepAfter" dataKey="value"
                  stroke="#00ff88" strokeWidth={2}
                  dot={{ fill: "#00ff88", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#555", fontSize: "14px" }}>
              No data yet — start a live session first
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div style={{
          background: "#1e1e2e", border: "0.5px solid #333",
          borderRadius: "12px", padding: "20px",
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px",
                       fontWeight: 500, color: "#ccc" }}>
            State Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name}
                      fill={STATE_COLORS_MAP[entry.name]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => (
                    <span style={{ fontSize: "12px",
                                   color: STATE_COLORS_MAP[v] }}>
                      {v}
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={{ background: "#1e1e2e",
                                  border: "0.5px solid #444",
                                  fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#555", fontSize: "14px" }}>
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Event Log */}
      <div style={{
        background: "#1e1e2e", border: "0.5px solid #333",
        borderRadius: "12px", padding: "20px",
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "15px",
                     fontWeight: 500, color: "#ccc" }}>
          Event Log
        </h3>
        {log.length === 0 ? (
          <div style={{ color: "#555", fontSize: "14px" }}>
            No events recorded yet
          </div>
        ) : (
          <div style={{ maxHeight: "240px", overflowY: "auto" }}>
            {[...log].reverse().map((entry, i) => {
              const t = new Date(entry.timestamp * 1000)
                          .toLocaleTimeString();
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "0.5px solid #2a2a3a",
                  fontSize: "13px",
                }}>
                  <span style={{
                    color: STATE_COLORS_MAP[entry.state],
                    fontWeight: 500, minWidth: "90px",
                  }}>
                    {entry.state}
                  </span>
                  <span style={{ color: "#888", flex: 1,
                                 padding: "0 12px" }}>
                    {entry.message}
                  </span>
                  <span style={{ color: "#555" }}>{t}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}