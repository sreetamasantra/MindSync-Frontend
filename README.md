# MindSync Frontend 
### React.js Interface for the MindSync Attention-Aware Intelligent Learning System

This repository contains the React.js frontend for MindSync — a real-time cognitive state detection and adaptive learning system. It connects to the [MindSync backend](https://github.com/sreetamasantra/MindSync) via REST API and displays live cognitive state, adaptive content, and session analytics.

---

##  What This Frontend Does

- Fetches cognitive state from the Flask backend every second
- Displays live state (Focused / Distracted / Fatigued / Confused) with colour-coded UI
- Shows real-time metrics: EAR, blink rate, head pose angles, confidence score
- Adapts displayed learning content based on detected state
- Provides a separate analytics dashboard with attention trend graph, state distribution chart, and timestamped event log

---

## Pages

### Live Session (`/`)
- Real-time cognitive state card with emoji and colour theme
- 5 metric cards: EAR, Blinks (5s), Pitch adj, Yaw adj, Confidence
- Adaptive content area that changes based on detected state
- Live / Backend offline status indicator

### Analytics (`/analytics`)
- Session summary — count of events per cognitive state
- Attention trend line chart — state changes over time
- State distribution donut chart
- Timestamped event log with scrollable history
- Reset session button

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React.js 18 | UI framework |
| React Router v6 | Multi-page navigation |
| Axios | HTTP requests to Flask API |
| Recharts | Attention trend + distribution charts |
| Inline CSS | Styling (no external CSS framework) |

---

## Getting Started

### Prerequisites
- Node.js v18+ and npm
- MindSync backend running at `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/sreetamasantra/MindSync-Frontend.git
cd MindSync-Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

### Make sure the backend is running first:
```bash
# In the MindSync backend directory
python app.py
```

---

## Project Structure

```
mindsync-frontend/
│
├── src/
│   ├── pages/
│   │   ├── Home.js          # Live session page
│   │   └── Analytics.js     # Analytics dashboard page
│   ├── App.js               # Router + Navbar
│   ├── App.css              # Global reset
│   └── index.js             # React entry point
│
├── public/
├── package.json
└── README.md
```

---

## Backend API Used

| Endpoint | Usage |
|----------|-------|
| `GET /api/state` | Fetched every 1 second for live state |
| `GET /api/session/log` | Fetched every 3 seconds for analytics |
| `POST /api/session/reset` | Called when Reset Session is clicked |
| `GET /api/health` | Backend connectivity check |

---

## State Colour Themes

| State | Colour |
|-------|--------|
| Focused | Green (#00ff88) |
| Distracted | Orange (#ff9900) |
| Fatigued | Red (#ff4444) |
| Confused | Purple (#cc44ff) |

---

## Related Repository

Backend (Python/Flask): [MindSync](https://github.com/sreetamasantra/MindSync)

---

##  Author

**Sreetama Santra**
B.Tech Student | CSE (IoT)

## 📄 License
This project is for academic purposes as part of a B.Tech Final Year Project.

This project is for academic purposes as part of a B.Tech Final Year Project.
