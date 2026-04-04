# Deployment Guide - AI Image Detector

This guide covers deploying your AI Image Detector application with:
- **Frontend**: React + Vite deployed on **Vercel**
- **Backend**: Flask API deployed on **Railway**

## Architecture Overview

```
┌─────────────────────────────────────┐
│      Frontend (React + Vite)        │
│      Deployed on Vercel             │
│  (Automatic deployments on push)    │
└────────────┬────────────────────────┘
             │ HTTPS API Calls
             ↓
┌─────────────────────────────────────┐
│      Backend (Flask + TensorFlow)   │
│      Deployed on Railway            │
│  (PostgreSQL optional for future)   │
└─────────────────────────────────────┘
```

---

## Part 1: Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with code pushed
- Vercel account (free tier available)

### Steps

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Git Repository"
   - Select your `AI-Image-Detector` repository
   - Click "Import"

2. **Configure Project Settings**
   - **Framework Preset**: Select "Vite"
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)

3. **Environment Variables**
   - Add `VITE_API_URL` variable pointing to your Railway backend URL
   - Example: `https://ai-image-detector-prod.up.railway.app`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your live URL (e.g., `https://ai-image-detector.vercel.app`)

### Auto-Deployment
- Every push to `master` branch automatically redeploys
- Preview deployments for pull requests available

---

## Part 2: Backend Deployment (Railway)

### Prerequisites
- Railway account (free tier with $5/month credit, available at [railway.app](https://railway.app))
- GitHub account with code pushed

### Steps

1. **Create New Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "+ New Project"
   - Select "Deploy from GitHub repo"
   - Select your `AI-Image-Detector` repository
   - Click "Deploy Now"

2. **Configure Environment Variables**
   Railway will auto-detect Python and install requirements.txt
   
   Add these environment variables in Railway dashboard:
   ```
   FLASK_ENV=production
   API_KEY=your_api_key_here
   GOOGLE_API_KEY=your_google_genai_api_key_here
   DEFAULT_RATE_LIMIT=60 per minute
   ANALYZE_RATE_LIMIT=20 per minute
   ```

3. **Configure Start Command**
   - In Railway: Go to "Variables" → "Generate Domain"
   - Railway should automatically detect the Procfile
   - If not, set start command to: `gunicorn -w 4 -b 0.0.0.0:$PORT backend.app:app`

4. **Get Backend URL**
   - Railway generates a public URL automatically
   - Example: `https://ai-image-detector-prod.up.railway.app`
   - Copy this URL for Vercel environment variables

### Auto-Deployment
- Every push to GitHub automatically triggers Railway deployment
- Deployments take ~2-3 minutes

---

## Part 3: Connect Frontend to Backend

### Update Environment Variables

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_API_URL` = `https://your-railway-backend-url`
3. Trigger redeployment or push new commit

**Your app is now live!**

---

## Testing Your Deployment

### Test Frontend
```bash
# Open your Vercel URL in browser
https://your-project.vercel.app
```

### Test API Connection
```javascript
// In browser console
fetch('https://your-railway-url/health')
  .then(r => r.json())
  .then(console.log)
```

### Test Image Upload
1. Go to your deployed Vercel URL
2. Try uploading an image
3. Check if analysis works

---

## Troubleshooting

### Frontend Build Fails
- Check that `npm run build` works locally
- Verify all dependencies in `package.json`
- Check Node.js version (should be 16+)

### Backend Deployment Fails
- Ensure `Procfile` exists and is correct
- Check all packages in `backend/requirements.txt` are available
- Verify `backend/app.py` exists (should auto-detect as entry point)

### API Calls Failing (CORS Error)
- Verify `VITE_API_URL` environment variable in Vercel
- Check that Flask backend has CORS enabled (already in code)
- Ensure Railway backend URL is correct and accessible

### Model Loading Issues
- Ensure `model.h5` is large (>100MB) and in `backend/` directory
- Consider using Git LFS for large files if deployment fails
- Railway provides 10GB for free tier

### Out of Memory
- Railway free tier has 512MB RAM
- If TensorFlow model is too large:
  - Use quantized model
  - Switch to Railway paid tier
  - Consider model optimization

---

## Environment Variables Reference

### Vercel (Frontend)
```
VITE_API_URL=https://your-railway-backend-url
```

### Railway (Backend)
```
FLASK_ENV=production
API_KEY=your_custom_api_key
GOOGLE_API_KEY=your_google_genai_api_key
DEFAULT_RATE_LIMIT=60 per minute
ANALYZE_RATE_LIMIT=20 per minute
```

---

## Current Configuration Files

### vercel.json
Configures Vercel build and deployment settings for frontend.

### Procfile
Rails-compatible format for Railway to start the Flask server.

### backend/requirements.txt
Updated with `gunicorn` for production server.

---

## Next Steps

1. Create accounts on Vercel and Railway
2. Connect your GitHub repository
3. Set environment variables
4. Deploy frontend first, then backend
5. Update Vercel's `VITE_API_URL` with Railway backend URL
6. Test the full application

**Expected deployment time: 5-10 minutes total**

---

## Monitoring & Updates

### View Logs
- **Vercel**: Projects → Logs tab
- **Railway**: Project → Logs tab

### Manual Redeploy
- **Vercel**: Project → Deployments → Redeploy
- **Railway**: Project → Deploy → Trigger Deploy

### Update Code
- Simply push to `master` branch
- Both platforms auto-deploy within seconds

---

## Cost Estimates (as of 2024)

| Platform | Free Tier | Cost |
|----------|-----------|------|
| Vercel | 100GB bandwidth/month | $20+/month for overages |
| Railway | $5 credit/month | $0.50/GB RAM/hour after credits |
| Total | Free for most apps | ~$10-20/month for modest traffic |

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Gunicorn Configuration](https://docs.gunicorn.org/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Your application is now production-ready!** 🚀
