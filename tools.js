// ===== ADDY-BUDDY TOOLS CONTROLLER =====
const SERVER_URL = "https://addy-budyy.onrender.com"; // <- tera backend link
const resultBox = document.getElementById("resultBox");

// master function — user ke click pe kaunsa tool chale
function useTool(tool) {
  resultBox.innerHTML = `<b>Loading ${tool}...</b> ⏳`;

  switch (tool) {
    case "chat": chatTool(); break;
    case "enhanceImage": imageEnhance(); break;
    case "removeBg": removeBg(); break;
    case "voiceEnhance": voiceEnhance(); break;
    case "summarize": summarize(); break;
    case "translate": translate(); break;
    case "codeGen": codeGen(); break;
    case "logoMaker": logoMaker(); break;
    case "resumeBuilder": resumeBuilder(); break;
    case "faceCleaner": faceCleaner(); break;
    case "quoteGen": quoteGen(); break;
    case "blogWriter": blogWriter(); break;
    case "artGen": artGen(); break;
    case "research": research(); break;
    case "seoWriter": seoWriter(); break;
    case "htmlBuilder": htmlBuilder(); break;
    case "captionGen": captionGen(); break;
    case "pdfExtract": pdfExtract(); break;
    case "tts": tts(); break;
    case "stt": stt(); break;
    default: resultBox.innerHTML = "Tool not found ❌";
  }
}

// --- helper to hit backend ---
async function callAPI(endpoint, body = {}) {
  try {
    const res = await fetch(`${SERVER_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return data.message || data.reply || JSON.stringify(data);
  } catch (err) {
    return "⚠️ Server not responding or endpoint missing.";
  }
}

// ---- individual tool logics ----
async function chatTool() {
  const prompt = promptUser("Ask ADDY something:");
  if (!prompt) return;
  const reply = await callAPI("chat", { prompt });
  showResult(reply);
}

async function imageEnhance() {
  showResult(await callAPI("enhance", { detail: "8K enhance" }));
}
async function removeBg() {
  showResult(await callAPI("remove-bg"));
}
async function voiceEnhance() {
  showResult(await callAPI("voice-enhance"));
}
async function summarize() {
  const text = promptUser("Paste text to summarize:");
  showResult(await callAPI("summarize", { text }));
}
async function translate() {
  const text = promptUser("Enter text to translate:");
  const lang = promptUser("Translate to (hi/en/es/etc):");
  showResult(await callAPI("translate", { text, lang }));
}
async function codeGen() {
  const prompt = promptUser("Describe the code you want:");
  showResult(await callAPI("codegen", { prompt }));
}
async function logoMaker() {
  const name = promptUser("Enter brand name:");
  showResult(await callAPI("logo", { name }));
}
async function resumeBuilder() {
  const name = promptUser("Enter your name:");
  showResult(await callAPI("resume", { name }));
}
async function faceCleaner() {
  showResult(await callAPI("face-clean"));
}
async function quoteGen() {
  showResult(await callAPI("quote"));
}
async function blogWriter() {
  const topic = promptUser("Blog topic:");
  showResult(await callAPI("blog", { topic }));
}
async function artGen() {
  const idea = promptUser("Art concept:");
  showResult(await callAPI("art", { idea }));
}
async function research() {
  const query = promptUser("Research about:");
  showResult(await callAPI("research", { query }));
}
async function seoWriter() {
  const topic = promptUser("SEO keyword/topic:");
  showResult(await callAPI("seo", { topic }));
}
async function htmlBuilder() {
  const desc = promptUser("Describe your webpage:");
  showResult(await callAPI("html", { desc }));
}
async function captionGen() {
  const text = promptUser("Enter post idea:");
  showResult(await callAPI("caption", { text }));
}
async function pdfExtract() {
  showResult(await callAPI("pdf"));
}
async function tts() {
  const text = promptUser("Enter text for voice:");
  showResult(await callAPI("tts", { text }));
}
async function stt() {
  showResult(await callAPI("stt"));
}

// --- UI helpers ---
function showResult(msg) {
  resultBox.innerHTML = `<pre>${msg}</pre>`;
}
function promptUser(q) {
  return window.prompt(q);
}
