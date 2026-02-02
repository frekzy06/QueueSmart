import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();

  try {
    // Vercel body check
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const { message, openLocs, closedLocs, time } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    /**
     * FIX: Use 'gemini-2.0-flash' or 'gemini-1.5-flash-latest'
     * Most 2026 accounts have moved to 2.0/2.5 logic.
     */
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are "QueueSmart AI". Time: ${time}. 
      OPEN: ${openLocs || "None"}. CLOSED: ${closedLocs || "None"}.
      User: "${message}". 
      Reply in friendly Indian style, max 2 sentences.`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
    
    return response.status(200).json({ text: aiText });

  } catch (error) {
    console.error("Backend Error:", error);
    // Return specific error to help us debug
    return response.status(500).json({ error: error.message });
  }
}
