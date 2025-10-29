import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ ADDY backend is running!");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const reply = `🤖 ADDY says: "${message.toUpperCase()}" — processed successfully!`;

  res.json({ reply });
});

app.listen(PORT, () => console.log(`✅ Server live on port ${PORT}`));
