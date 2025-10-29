
// server.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors()); // allow all origins (for demo). In production restrict origins.

// serve static files (if you put index.html in same repo & serve from this server)
app.use('/', express.static(path.join(__dirname, '/')));

// multer for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });

// helper: make data URL
function makeDataUrl(buffer, mime = 'image/png') {
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

// POST /api/process
// Accepts form-data (file) OR JSON body { tool, prompt }
// If file is passed, multer stores it in req.file
app.post('/api/process', upload.single('file'), async (req, res) => {
  try {
    const tool = (req.body.tool || req.query.tool || '').trim();
    const prompt = (req.body.prompt || req.query.prompt || '').toString();
    const file = req.file; // may be undefined

    if (!tool) return res.status(400).json({ error: 'Missing "tool" parameter.' });

    // -----------------------
    // Image Enhance (sharp)
    // -----------------------
    if (tool === 'Image Enhance') {
      if (!file) return res.status(400).json({ error: 'Upload an image file (form-data field "file").' });

      const image = sharp(file.buffer);
      const meta = await image.metadata();
      // upscale a bit, sharpen, slight color boost, then downscale back
      const upW = Math.min(Math.round((meta.width || 800) * 1.6), 3000);
      const upH = Math.min(Math.round((meta.height || 600) * 1.6), 3000);

      const bufUp = await image
        .resize(upW, upH, { fit: 'inside' })
        .sharpen()
        .modulate({ saturation: 1.07, brightness: 1.02 })
        .toBuffer();

      const final = await sharp(bufUp)
        .resize(Math.round(meta.width || upW), Math.round(meta.height || upH), { fit: 'inside' })
        .png()
        .toBuffer();

      return res.json({ ok: true, note: 'enhanced', file: { name: 'enhanced.png', data: makeDataUrl(final, 'image/png') } });
    }

    // -----------------------
    // Image Generation (HuggingFace) - requires HF token in env
    // -----------------------
    if (tool === 'Image Gen') {
      const HF = process.env.HF_TOKEN;
      if (!HF) return res.status(400).json({ error: 'HF_TOKEN not configured in environment. Add HuggingFace token to enable image generation.' });
      const model = process.env.HF_MODEL || 'stabilityai/stable-diffusion-2';
      // call HF inference
      const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${HF}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt })
      });
      if (!hfRes.ok) {
        const text = await hfRes.text();
        return res.status(500).json({ error: 'HuggingFace error', details: text });
      }
      const blob = await hfRes.buffer();
      return res.json({ ok: true, file: { name: 'gen.png', data: makeDataUrl(blob, 'image/png') } });
    }

    // -----------------------
    // Translator (LibreTranslate)
    // -----------------------
    if (tool === 'Translator') {
      if (!prompt) return res.status(400).json({ error: 'prompt text required for Translator.' });
      const target = req.body.target || req.query.target || 'en';
      const ltRes = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: prompt, source: 'auto', target, format: 'text' })
      });
      const j = await ltRes.json();
      return res.json({ ok: true, text: j.translatedText || JSON.stringify(j) });
    }

    // -----------------------
    // Text Summarize (simple)
    // -----------------------
    if (tool === 'Text Summarize') {
      if (!prompt) return res.status(400).json({ error: 'prompt text required for summarize.' });
      const parts = prompt.split(/(?<=[.?!])\s+/).filter(Boolean);
      parts.sort((a, b) => b.length - a.length);
      const summary = parts.slice(0, 2).join(' ');
      return res.json({ ok: true, text: summary });
    }

    // -----------------------
    // Text Rewrite (simple)
    // -----------------------
    if (tool === 'Text Rewrite') {
      if (!prompt) return res.status(400).json({ error: 'prompt text required for rewrite.' });
      const out = prompt.split(/(?<=[.?!])\s+/).map(s => s.length > 120 ? s.slice(0, 100) + '...' : s).join(' ');
      return res.json({ ok: true, text: out });
    }

    // -----------------------
    // Voice Enhance (demo) - returns original unless OPENAI/other added
    // -----------------------
    if (tool === 'Voice Enhance') {
      if (!file) return res.status(400).json({ error: 'Upload audio file as form-data "file".' });
      const OPENAI = process.env.OPENAI_KEY;
      if (!OPENAI) {
        // demo: return original file back as data URL
        return res.json({ ok: true, note: 'no-OPENAI - returned original audio', file: { name: file.originalname || 'audio.webm', data: makeDataUrl(file.buffer, file.mimetype || 'audio/webm') } });
      } else {
        // placeholder: here you can call a real API (Whisper via OpenAI or other) and return transcript/enhanced audio
        return res.json({ ok: false, error: 'Voice Enhance via OpenAI/Whisper not implemented in this template. Add code to call your service.' });
      }
    }

    // -----------------------
    // Chat: call OpenAI if key present, otherwise simulated
    // -----------------------
    if (tool === 'Chat') {
      const OPENAI = process.env.OPENAI_KEY;
      if (OPENAI && prompt) {
        // Example: OpenAI ChatCompletion (server-side). Model & endpoint may vary.
        try {
          const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
          const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${OPENAI}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: 600 })
          });
          const j = await r.json();
          const content = j?.choices?.[0]?.message?.content || JSON.stringify(j);
          return res.json({ ok: true, text: content });
        } catch (err) {
          return res.status(500).json({ error: 'OpenAI error', details: String(err) });
        }
      } else {
        // simulated reply
        const samples = [
          "I'm ADDY — demo server. To enable real chat connect OpenAI in Render env (OPENAI_KEY).",
          "Try: 'Enhance image: HD vivid' or 'Summarize: <paste text>'"
        ];
        return res.json({ ok: true, text: samples[Math.floor(Math.random() * samples.length)] });
      }
    }

    // fallback
    return res.json({ ok: false, error: `Tool "${tool}" not implemented on server.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

// health route
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  // Dummy AI reply (test ke liye)
  res.json({ reply: `🤖 Buddy says: "${message}" processed successfully!` });
});

app.listen(10000, () => console.log("✅ Server running on port 10000"));
