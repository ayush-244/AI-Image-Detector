# Contributing Guide

Thank you for contributing to AI Image Detector.

## Development Setup

1. Install frontend dependencies:
   - `npm install`
2. Install backend dependencies:
   - `cd backend`
   - `pip install -r requirements.txt`
3. (Optional) Configure environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Add `GOOGLE_API_KEY` if Gemini explanations are needed.

## Branching

- Create a feature branch from `main`.
- Keep pull requests focused and small when possible.

## Quality Checks

Run before opening a pull request:

- Frontend lint: `npm run lint`
- Frontend build: `npm run build`
- Python format check: `black --check backend`
- Python lint: `ruff check backend`

## Commit Style

Use clear and descriptive commit messages, for example:

- `feat: add Grad-CAM legend`
- `fix: handle invalid upload mime type`
- `docs: improve backend setup section`

## Pull Request Checklist

- Code builds successfully.
- No new lint errors.
- Documentation updated if behavior changed.
- Screenshots added for UI changes.
