# AI Image Detector

AI Image Detector is a full-stack application that classifies uploaded images as **REAL** or **FAKE** using a TensorFlow model, then explains the prediction with Grad-CAM visualization and optional Gemini-generated text.

## Project Status

This repository is now set up with professional project standards:

- Frontend lint and build quality gates
- Frontend unit testing with Vitest and React Testing Library
- Backend formatting and lint checks
- Backend unit test structure with pytest
- GitHub Actions CI pipeline
- Docker and Docker Compose support
- Contribution and license documentation

## Key Features

- Image authenticity classification with confidence score
- Grad-CAM heatmap generation for model explainability
- Inference metadata (probabilities, activation strength, latency)
- Optional Gemini-powered natural language explanation
- Single-page React interface with upload, analytics, and visual outputs
- Optional API key authentication and request rate limiting

## Tech Stack

- Frontend: React 18, Vite 6, Tailwind CSS 3, Framer Motion, Recharts, Axios
- Backend: Flask, TensorFlow, OpenCV, NumPy, Flask-CORS
- Explainability: Grad-CAM
- Optional AI service: Google Gemini (`google-genai`)
- Quality tooling: ESLint, Prettier, Black, Ruff, GitHub Actions

## Architecture

1. User uploads an image from the web UI.
2. Frontend sends multipart form data to `POST /analyze`.
3. Flask backend runs model inference and Grad-CAM processing.
4. Backend stores heatmap output in `backend/outputs/`.
5. Frontend renders prediction summary, confidence graph, heatmap, and explanation.

## Repository Structure

```text
AI-Image-Detector/
├── backend/
│   ├── app.py                 # Flask API entry point
│   ├── predict.py             # Prediction helpers
│   ├── gradcam.py             # Heatmap generation utilities
│   ├── gemini_service.py      # Optional Gemini explanation integration
│   ├── model.h5               # Trained model file used in inference
│   ├── requirements.txt       # Backend dependencies
│   ├── requirements-dev.txt   # Backend quality tooling dependencies
│   ├── Dockerfile             # Backend container image
│   ├── uploads/               # Uploaded images (runtime)
│   └── outputs/               # Generated heatmaps (runtime)
├── src/
│   ├── App.jsx
│   ├── api.js
│   └── components/
├── .github/workflows/ci.yml   # CI pipeline
├── Dockerfile                 # Frontend container image
├── docker-compose.yml         # Local multi-service orchestration
├── pyproject.toml             # Python lint/format configuration
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── vite.config.js
```

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+ (recommended for TensorFlow compatibility)
- pip

## Local Development Setup

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure environment variables (optional)

Create `backend/.env`:

```env
GOOGLE_API_KEY=your_google_ai_api_key
API_KEY=your_backend_api_key
DEFAULT_RATE_LIMIT=60 per minute
ANALYZE_RATE_LIMIT=20 per minute
```

If `GOOGLE_API_KEY` is missing or invalid, the app falls back to a built-in non-Gemini explanation.

If `API_KEY` is set, requests to `POST /analyze` must include the `X-API-Key` header.

For the frontend, create a root `.env` file if needed:

```env
VITE_API_KEY=your_backend_api_key
```

## Quality Checks

### Frontend

```bash
npm run lint
npm run test:run
npm run build
```

### Backend

```bash
cd backend
black --check .
ruff check .
pytest tests -q
```

### Combined frontend check

```bash
npm run check
```

## Running the Application

### Start backend

```bash
cd backend
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

### Start frontend (new terminal)

```bash
npm run dev
```

Frontend runs on `http://127.0.0.1:5173` by default.

## CI Pipeline

GitHub Actions workflow in `.github/workflows/ci.yml` runs:

- Frontend lint (`npm run lint`)
- Frontend unit tests (`npm run test:run`)
- Frontend build (`npm run build`)
- Backend formatting check (`black --check backend`)
- Backend lint (`ruff check backend`)
- Backend unit tests (`pytest backend/tests -q`)
- Backend syntax verification (`python -m compileall backend`)

## Docker

### Run with Docker Compose

```bash
docker compose up --build
```

Services:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:5000`

To stop:

```bash
docker compose down
```

## Development Proxy

Vite is configured to proxy:

- `/analyze` -> `http://127.0.0.1:5000/analyze`
- `/outputs/*` -> `http://127.0.0.1:5000/outputs/*`

This means both frontend and backend should run simultaneously in development.

## API Reference

### `POST /analyze`

Analyzes an uploaded image and returns classification and explainability data.

Request:

- Content type: `multipart/form-data`
- Field: `image` (file)
- Header: `X-API-Key` (required only when backend `API_KEY` is configured)

### `GET /health`

Returns a basic service health status for uptime checks.

Response:

```json
{
	"status": "ok"
}
```

Response (example):

```json
{
	"label": "REAL",
	"confidence": 93.21,
	"real_probability": 0.9321,
	"fake_probability": 0.0679,
	"inference_time_ms": 124,
	"activation_strength": 0.4812,
	"model_version": "cnn-mobilenetv2-v1",
	"heatmap_url": "/outputs/abc123.png",
	"explanation": "The model focused on coherent facial texture and edge continuity..."
}
```

## Available npm Scripts

- `npm run dev` - Start Vite development server
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once (CI mode)
- `npm run lint` - Run ESLint
- `npm run format` - Format code using Prettier
- `npm run format:check` - Verify formatting with Prettier
- `npm run check` - Run lint and build
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run backend` - Start Flask backend from project root

## Project Governance

- Contribution guide: `CONTRIBUTING.md`
- License: `LICENSE` (MIT)
- Environment template: `backend/.env.example`

## Troubleshooting

- Backend not reachable from UI:
	Ensure Flask is running on `127.0.0.1:5000` and frontend is started via Vite.
- TensorFlow/model loading errors:
	Verify `backend/model.h5` exists and Python/TensorFlow versions are compatible.
- Gemini explanations unavailable:
	Check `GOOGLE_API_KEY` in `backend/.env`; fallback explanations should still appear.

## Notes

- Runtime artifacts are written to `backend/uploads/` and `backend/outputs/`.
- CORS is enabled in the backend for local development.
- If `model.h5` is not found, backend returns deterministic fallback outputs to keep the UI functional.
