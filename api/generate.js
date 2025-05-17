export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { topic, tone, type, style, target } = req.body;

  if (!topic || !tone || !type || !style || !target) {
    return res.status(400).json({ error: "Fehlende Eingabedaten" });
  }

  const prompt = `Schreibe einen ${tone} ${type} im Stil von ${style} für die Zielgruppe "${target}" zum Thema "${topic}".`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error("Fehler bei der API-Anfrage:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
