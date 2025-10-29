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
# ADDY — Universal AI Tools (Client-side)

🚀 Free, fully client-side AI tools — **no API key required!**

### ✅ Features
- 💬 Local Chat (no API)
- 🖼️ Image Editor (brightness, contrast, sharpen)
- ✨ Enhance (pseudo upscaler)
- 🧍 Background Remove (BodyPix)
- 🧾 OCR Text Extract (Tesseract.js)
- 🔊 Voice Enhance (WebAudio filters)
- 📱 QR Generator
- 📦 Export / Download tools

### 🧰 Tech Stack
- HTML + JS + Canvas
- TensorFlow.js + BodyPix
- Tesseract.js
- WebAudio API + QRCode.js

### ⚡ How to Run
1. Copy `index.html` to your GitHub repo.
2. Go to **Settings → Pages → Deploy from Branch**  
   - Branch: `main`  
   - Folder: `/ (root)`
3. Save → after a minute, open  
   🔗 `https://<username>.github.io/<repo-name>/`

Example:  
`https://gulladj61-sketch.github.io/ADDY-budyy/`

### 🧠 Tips
- Works offline (after cache).
- Runs fully in browser — no backend or Render needed.
- First load may take 5–10 seconds (models load in background).

---

> Built by Gaurav Kashyap (ADDY-buddy Project)  
> ✨ 100% client-side, 0% API key.
