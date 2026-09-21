import { useState } from "react";

const ACCURACY    = 85.73;
const F1_SCORE    = 85.78;
const CV_ACCURACY = 74.16;
const CV_STD      = 4.98;

const CLASS_METRICS = [
  { name: "Confused",    precision: 0.76, recall: 0.90, f1: 0.82,
    support: 181, color: "#cc44ff" },
  { name: "Distracted",  precision: 0.92, recall: 0.82, f1: 0.87,
    support: 184, color: "#ff9900" },
  { name: "Fatigued",    precision: 0.90, recall: 0.92, f1: 0.91,
    support: 215, color: "#ff4444" },
  { name: "Focused",     precision: 0.86, recall: 0.80, f1: 0.83,
    support: 205, color: "#00ff88" },
];

const FEATURES = [
  { name: "pitch_adj",     importance: 0.2968 },
  { name: "blink_rate",    importance: 0.2408 },
  { name: "yaw_adj",       importance: 0.2261 },
  { name: "ear",           importance: 0.1405 },
  { name: "closed_frames", importance: 0.0957 },
];

const CONFUSION = [
  { actual: "Confused",   predicted: { Confused: 162, Distracted: 4,  Fatigued: 10, Focused: 5  }},
  { actual: "Distracted", predicted: { Confused: 22,  Distracted: 151,Fatigued: 1,  Focused: 10 }},
  { actual: "Fatigued",   predicted: { Confused: 5,   Distracted: 1,  Fatigued: 197,Focused: 12 }},
  { actual: "Focused",    predicted: { Confused: 24,  Distracted: 8,  Fatigued: 10, Focused: 163}},
];

const CLASSES = ["Confused", "Distracted", "Fatigued", "Focused"];

const STATE_COLORS = {
  Confused:   "#cc44ff",
  Distracted: "#ff9900",
  Fatigued:   "#ff4444",
  Focused:    "#00ff88",
};

function MetricCard({ label, value, unit, sub, color }) {
  return (
    <div style={{
      background: "#1e1e2e",
      border: `1px solid ${color || "#333"}`,
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{
        fontSize: "36px", fontWeight: 600,
        color: color || "#fff",
      }}>
        {value}
        <span style={{ fontSize: "18px" }}>{unit}</span>
      </div>
      {sub && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function Metrics() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const maxVal = Math.max(...CONFUSION.flatMap(r =>
    Object.values(r.predicted)));

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>
          Model Performance
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>
          Random Forest Classifier — trained on 3921 self-collected samples
        </p>
      </div>

      {/* Top metric cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px", marginBottom: "24px",
      }}>
        <MetricCard label="Accuracy"
          value={ACCURACY} unit="%" color="#00ff88"
          sub="on held-out test set" />
        <MetricCard label="F1 Score (weighted)"
          value={F1_SCORE} unit="%" color="#00ff88"
          sub="across all 4 classes" />
        <MetricCard label="CV Accuracy (5-fold)"
          value={CV_ACCURACY} unit="%" color="#4488ff"
          sub={`± ${CV_STD}%`} />
        <MetricCard label="Dataset Size"
          value="3,921" unit="" color="#ff9900"
          sub="labeled samples" />
      </div>

      {/* Confusion matrix + Feature importance */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px", marginBottom: "24px",
      }}>

        {/* Confusion Matrix */}
        <div style={{
          background: "#1e1e2e",
          border: "0.5px solid #333",
          borderRadius: "12px", padding: "20px",
        }}>
          <h3 style={{
            margin: "0 0 16px", fontSize: "15px",
            fontWeight: 500, color: "#ccc",
          }}>
            Confusion Matrix
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              borderCollapse: "collapse",
              width: "100%", fontSize: "13px",
            }}>
              <thead>
                <tr>
                  <th style={{
                    padding: "8px", color: "#666",
                    fontSize: "11px", textAlign: "left",
                  }}>
                    Actual ↓ / Predicted →
                  </th>
                  {CLASSES.map(c => (
                    <th key={c} style={{
                      padding: "8px", textAlign: "center",
                      color: STATE_COLORS[c], fontSize: "12px",
                    }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONFUSION.map(row => (
                  <tr key={row.actual}>
                    <td style={{
                      padding: "8px",
                      color: STATE_COLORS[row.actual],
                      fontWeight: 500, fontSize: "12px",
                    }}>
                      {row.actual}
                    </td>
                    {CLASSES.map(pred => {
                      const val      = row.predicted[pred];
                      const isCorrect = row.actual === pred;
                      const intensity = val / maxVal;
                      const cellKey  = `${row.actual}-${pred}`;
                      return (
                        <td key={pred}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            background: isCorrect
                              ? `rgba(0,255,136,${intensity * 0.6})`
                              : `rgba(255,68,68,${intensity * 0.4})`,
                            color: hoveredCell === cellKey ? "#fff" : "#ddd",
                            fontWeight: isCorrect ? 600 : 400,
                            borderRadius: "4px",
                            cursor: "default",
                            transition: "all 0.2s",
                            fontSize: "14px",
                          }}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{
            fontSize: "11px", color: "#555",
            marginTop: "12px", margin: "12px 0 0",
          }}>
            Green = correct predictions · Red = misclassifications
          </p>
        </div>

        {/* Feature Importance */}
        <div style={{
          background: "#1e1e2e",
          border: "0.5px solid #333",
          borderRadius: "12px", padding: "20px",
        }}>
          <h3 style={{
            margin: "0 0 16px", fontSize: "15px",
            fontWeight: 500, color: "#ccc",
          }}>
            Feature Importances
          </h3>
          {FEATURES.map((f, i) => (
            <div key={f.name} style={{ marginBottom: "14px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
                fontSize: "13px",
              }}>
                <span style={{ color: "#ccc" }}>{f.name}</span>
                <span style={{ color: "#888" }}>
                  {(f.importance * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{
                background: "#2a2a3a",
                borderRadius: "4px", height: "8px",
              }}>
                <div style={{
                  width: `${f.importance * 100 / 0.30 * 100}%`,
                  maxWidth: "100%",
                  height: "100%",
                  borderRadius: "4px",
                  background: i === 0 ? "#00ff88"
                             : i === 1 ? "#4488ff"
                             : i === 2 ? "#ff9900"
                             : i === 3 ? "#ff4444"
                             : "#cc44ff",
                  transition: "width 0.5s ease",
                }}/>
              </div>
            </div>
          ))}
          <p style={{
            fontSize: "11px", color: "#555", marginTop: "16px",
          }}>
            pitch_adj (head tilt) is the strongest predictor of cognitive state
          </p>
        </div>
      </div>

      {/* Per-class table */}
      <div style={{
        background: "#1e1e2e",
        border: "0.5px solid #333",
        borderRadius: "12px", padding: "20px",
      }}>
        <h3 style={{
          margin: "0 0 16px", fontSize: "15px",
          fontWeight: 500, color: "#ccc",
        }}>
          Per-Class Classification Report
        </h3>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: "14px",
        }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid #333" }}>
              {["Class","Precision","Recall",
                "F1-Score","Support"].map(h => (
                <th key={h} style={{
                  padding: "10px 12px", textAlign: "center",
                  color: "#666", fontSize: "12px",
                  fontWeight: 500,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASS_METRICS.map(row => (
              <tr key={row.name}
                style={{ borderBottom: "0.5px solid #1a1a2a" }}>
                <td style={{
                  padding: "12px", fontWeight: 500,
                  color: row.color,
                }}>
                  {row.name}
                </td>
                {[row.precision, row.recall, row.f1].map((v, i) => (
                  <td key={i} style={{
                    padding: "12px", textAlign: "center",
                    color: v >= 0.90 ? "#00ff88"
                          : v >= 0.80 ? "#ff9900"
                          : "#ff4444",
                  }}>
                    {v.toFixed(2)}
                  </td>
                ))}
                <td style={{
                  padding: "12px", textAlign: "center",
                  color: "#666",
                }}>
                  {row.support}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: "1px solid #333" }}>
              <td style={{
                padding: "12px", color: "#888",
                fontSize: "12px",
              }}>
                weighted avg
              </td>
              <td style={{
                padding: "12px", textAlign: "center",
                color: "#00ff88", fontWeight: 600,
              }}>
                0.86
              </td>
              <td style={{
                padding: "12px", textAlign: "center",
                color: "#00ff88", fontWeight: 600,
              }}>
                0.86
              </td>
              <td style={{
                padding: "12px", textAlign: "center",
                color: "#00ff88", fontWeight: 600,
              }}>
                0.86
              </td>
              <td style={{
                padding: "12px", textAlign: "center",
                color: "#666",
              }}>
                785
              </td>
            </tr>
          </tbody>
        </table>

        {/* Model info footer */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px", marginTop: "20px",
          padding: "16px",
          background: "#16162a",
          borderRadius: "8px",
          fontSize: "12px",
        }}>
          <div>
            <span style={{ color: "#666" }}>Algorithm: </span>
            <span style={{ color: "#ccc" }}>Random Forest</span>
          </div>
          <div>
            <span style={{ color: "#666" }}>Estimators: </span>
            <span style={{ color: "#ccc" }}>100 trees</span>
          </div>
          <div>
            <span style={{ color: "#666" }}>Max depth: </span>
            <span style={{ color: "#ccc" }}>10</span>
          </div>
          <div>
            <span style={{ color: "#666" }}>Train size: </span>
            <span style={{ color: "#ccc" }}>3136 samples</span>
          </div>
          <div>
            <span style={{ color: "#666" }}>Test size: </span>
            <span style={{ color: "#ccc" }}>785 samples</span>
          </div>
          <div>
            <span style={{ color: "#666" }}>Class weights: </span>
            <span style={{ color: "#ccc" }}>balanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}