import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // 1. CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // 2. SAFE BODY PARSING
    // If request.body is a string, parse it. If it's already an object, use it.
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    
    if (!body || !body.message) {
      return response.status(400).json({ error: "Missing message in request body" });
    }

    const { message, openLocs, closedLocs, time } = body;

    // 3. INITIALIZE SDK
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using 'gemini-1.5-flash' (the most stable identifier for 2026)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "QueueSmart AI". Current Time: ${time || 'Unknown'}
      OPEN Facilities: ${openLocs || "None"}
      CLOSED Facilities: ${closedLocs || "None"}
      User said: "${message}"
      
      Instructions:
      - Suggest an OPEN facility if asked for recommendations.
      - Keep response under 2 sentences. Friendly Indian tone.
    `;

    // 4. GENERATE CONTENT WITH TIMEOUT PROTECTION
    const result = await model.generateContent(prompt);
    const responseData = await result.response;
    const aiText = responseData.text();
    
    return response.status(200).json({ text: aiText });

  } catch (error) {
    console.error("DETAILED BACKEND ERROR:", error);
    // Return the actual error message to the frontend for debugging
    return response.status(500).json({ 
      error: "AI Generation Failed", 
      details: error.message 
    });
  }
}
