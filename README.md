# AI Image Detector Dashboard

A full-stack application for detecting AI-generated vs real images using a CNN model with Grad-CAM visualization and Gemini-powered explanations.

## Project Structure

```
AI-Image-Detector/
├── backend/           # Flask API (Python)
│   ├── app.py         # Main server
│   ├── predict.py     # Model inference
│   ├── gradcam.py     # Grad-CAM heatmap
│   ├── gemini_service.py  # AI explanations
│   ├── requirements.txt
│   └── model.h5       # Trained model (place here)
├── src/               # React frontend (Vite)
│   ├── App.jsx
│   ├── api.js
│   └── components/
├── index.html
├── package.json
└── vite.config.js
```

## Setup & Run

### 1. Frontend

```bash
npm install
npm run dev
```

Frontend runs at http://127.0.0.1:5173

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at http://127.0.0.1:5000

### 3. Optional: Gemini explanations

Create `backend/.env` with:

```
GOOGLE_API_KEY=your_key_here
```

Without it, explanations will fall back to a basic summary.

## Run Order

1. Start the backend first (`python app.py` in `backend/`)
2. Start the frontend (`npm run dev` in project root)
3. Open http://127.0.0.1:5173

The Vite dev server proxies `/analyze` and `/outputs` to the backend, so both must be running for full functionality.
