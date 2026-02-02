import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. PARSE BODY (Handles both Vercel's helper and raw streams)
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (req.readable) {
      // Manual stream parsing if req.body is empty/unparsed
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      body = JSON.parse(Buffer.concat(chunks).toString());
    }

    const { message, openLocs, closedLocs, time } = body;

    // 3. INITIALIZE GEMINI
    // We use gemini-2.0-flash because it appeared in your 'listModels' check
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are "QueueSmart AI". Time: ${time || 'unknown'}. 
      OPEN: ${openLocs || "None"}. CLOSED: ${closedLocs || "None"}.
      User: "${message}"
      Instructions: Answer in 1-2 friendly sentences. Indian English accent style. No special symbols.
    `;

    // 4. EXECUTE
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("CRASH LOG:", error);
    return res.status(500).json({ 
      error: "Backend Error", 
      message: error.message 
    });
  }
}
