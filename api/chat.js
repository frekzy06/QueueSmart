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

  // 2. Handle Options (Pre-flight check)
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  try {
    // 3. Get the data from your frontend
    const { message, openLocs, closedLocs, time } = request.body;

    // 4. Initialize Gemini with the SECRET key (from Vercel Settings)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 5. Build the prompt here (Backend side)
    const prompt = `
      You are "QueueSmart AI". Current Time: ${time}
      OPEN Facilities: ${openLocs || "None"}
      CLOSED Facilities: ${closedLocs || "None"}
      User said: "${message}"
      Instructions:
      1. If greeting, welcome warmly.
      2. If general question, answer briefly.
      3. If asking for recommendation, suggest an OPEN facility.
      4. If asking about CLOSED facility, say it's closed and suggest open one.
      5. Keep response under 2 sentences. Spoken style.
    `;

    // 6. Generate and send back
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    response.status(200).json({ text: responseText });

  } catch (error) {
    console.error("Backend Error:", error);
    response.status(500).json({ error: "Failed to fetch AI response" });
  }
}
