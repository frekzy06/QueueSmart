import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // 1. Setup headers for CORS (allows your frontend to talk to this backend)
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle Options (Pre-flight check for browser safety)
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  try {
    // 3. Parse Body Safely (Vercel can send strings or objects)
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    
    if (!body || !body.message) {
      return response.status(400).json({ error: "No message provided" });
    }

    const { message, openLocs, closedLocs, time } = body;

    // 4. Initialize Gemini with your SECRET key (Ensure GEMINI_API_KEY is in Vercel Settings)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using 'gemini-2.0-flash' - Stable and Free-Tier Friendly in 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 5. Build the system prompt
    const prompt = `
      You are "QueueSmart AI". Current Time: ${time || 'Unknown'}
      OPEN Facilities: ${openLocs || "None"}
      CLOSED Facilities: ${closedLocs || "None"}
      User said: "${message}"
      
      Instructions:
      1. Answer in a friendly, helpful Indian tone (Indian English).
      2. If asking for recommendation, suggest an OPEN facility.
      3. If asking about a CLOSED facility, suggest an open alternative.
      4. Keep response under 2 sentences. Spoken style.
      5. Do not use emojis, asterisks, or bold text.
    `;

    // 6. Generate Content
    const result = await model.generateContent(prompt);
    const resultResponse = await result.response;
    const responseText = resultResponse.text();
    
    // 7. Send back the clean JSON
    return response.status(200).json({ text: responseText });

  } catch (error) {
    console.error("Backend Error:", error);
    return response.status(500).json({ 
      error: "AI failed to respond", 
      details: error.message 
    });
  }
}
