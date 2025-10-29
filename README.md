# ADDY-budyy — Deploy Quick Guide

## Files included
- server.js
- package.json
- index.html

## Deploy to Render (recommended, free)
1. Push this repo to GitHub (main branch).
2. Login to https://render.com and connect your GitHub.
3. Create New → Web Service → select this repo.
4. Set:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free
5. Deploy.
6. After deploy, note your service URL, e.g. `https://addy-budyy.onrender.com`.
7. If frontend hosted on GitHub Pages, edit `index.html` and set `API_BASE` to `https://<your-render-url>/api/process`.
8. Test Image Enhance: select tool "Image Enhance", attach image, click Send.

## Add API keys (optional)
- On Render dashboard → Environment → Add Variables:
  - HF_TOKEN (for HuggingFace image gen)
  - OPENAI_KEY (for OpenAI Chat/Whisper)
  - OPENAI_MODEL (optional)

Security note: Do not commit secret keys to GitHub. Keep them in Render environment variables.
