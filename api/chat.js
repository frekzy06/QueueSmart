import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to parse body manually if Vercel doesn't do it
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export default async function handler(request, response) {
  // 1. CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // 2. FORCE PARSE BODY
    let body;
    if (typeof request.body === 'object') {
      body = request.body;
    } else {
      const rawBody = await getRawBody(request);
      body = JSON.parse(rawBody);
    }

    const { message, openLocs, closedLocs, time } = body;

    if (!message) {
      return response.status(400).json({ error: "Message is required" });
    }

    // 3. INITIALIZE GEMINI 2.0 FLASH
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are "QueueSmart AI". Time: ${time || 'unknown'}. 
      OPEN: ${openLocs || "None"}. CLOSED: ${closedLocs || "None"}.
      User: "${message}"
      Reply in friendly Indian English, max 2 sentences. No symbols.
    `;

    // 4. EXECUTE
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const aiText = aiResponse.text();

    return response.status(200).json({ text: aiText });

  } catch (error) {
    console.error("Vercel Backend Crash:", error);
    return response.status(500).json({ 
      error: "Backend Logic Error", 
      details: error.message 
    });
  }
}
