export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { topic, tone, type, style } = req.body;

  if (!topic || !tone || !type || !style) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const prompt = `Schreibe einen ${style} ${type} zum Thema "${topic}" für die Zielgruppe "${tone}".`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;

    if (!message) {
      return res.status(500).json({ error: "No response from AI" });
    }

    res.status(200).json({ text: message });
  } catch (error) {
    res.status(500).json({ error: "Request failed", details: error.message });
  }
}
// /api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { target, topic, type, tone } = req.body;

  if (!target || !topic || !type || !tone) {
    return res.status(400).json({ error: "Fehlende Eingaben" });
  }

  const prompt = `Erstelle einen ${tone} ${type} für die Zielgruppe "${target}" zum Thema "${topic}".`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Keine Antwort von OpenAI erhalten" });
    }

    const result = data.choices[0].message.content;
    res.status(200).json({ result });

  } catch (error) {
    console.error("Fehler beim Aufruf von OpenAI:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
