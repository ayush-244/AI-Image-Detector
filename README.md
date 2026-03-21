# NextWare AI Image Detector

A full-stack AI image authenticity platform with a **single-page SaaS UI** on top of a Flask/TensorFlow backend.

Flow:
**Hero -> Upload -> Analyze -> Results -> Heatmap -> Explanation**

## Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3, Framer Motion, Recharts, Axios
- **Backend:** Flask, TensorFlow, OpenCV, NumPy
- **Explainability:** Grad-CAM + optional Gemini explanation service

## Project Structure

```text
AI-Image-Detector/
├── backend/
│   ├── app.py
│   ├── predict.py
│   ├── gradcam.py
│   ├── gemini_service.py
│   ├── requirements.txt
│   └── model.h5
├── src/
│   ├── App.jsx
│   ├── api.js
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── Navbar.jsx
│       ├── UploadCard.jsx
│       ├── StatsCards.jsx
│       ├── ConfidenceGraph.jsx
│       ├── HeatmapViewer.jsx
│       └── ExplanationPanel.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Setup

### Frontend dependencies

```bash
npm install
```

### Backend dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

## Run

### 1) Start backend

```bash
cd backend
python app.py
```

Backend URL: `http://127.0.0.1:5000`

### 2) Start frontend (new terminal)

```bash
npm run dev
```

Frontend URL is usually `http://127.0.0.1:5173`.
If that port is already in use, Vite automatically picks the next free port (for example `5174`).

## API Proxy (Dev)

Vite proxies these frontend paths to Flask:

- `/analyze` -> `http://127.0.0.1:5000/analyze`
- `/outputs/*` -> `http://127.0.0.1:5000/outputs/*`

So both frontend and backend must be running in development.

## Optional Gemini Setup

Create `backend/.env`:

```env
GOOGLE_API_KEY=your_key_here
```

If this key is missing or invalid, the app still works and falls back to a safe text explanation.

## Notes

- The frontend is intentionally **single-page** (no landing/dashboard route split).
- Upload preview and heatmap viewer use safe blob URL lifecycle handling.
- Results section appears after analysis and auto-scrolls into view.
