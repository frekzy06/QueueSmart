import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Manually check for body (Vercel Node runtime fix)
    const body = req.body || {};
    const { message, openLocs, closedLocs, time } = body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // 2. Initialize with your Vercel Environment Variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 3. USE THE EXACT MODEL STRING FROM YOUR LIST
    // Based on your console list, this is the most stable one for you:
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      apiVersion: "v1beta" 
    });

    const prompt = `You are "QueueSmart AI". Time: ${time}. 
    Facilities Open: ${openLocs}. Closed: ${closedLocs}.
    User: "${message}"
    Reply as a helpful Indian assistant in under 2 sentences. No symbols.`;

    // 4. Call the API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("Vercel Function Error:", error);
    return res.status(500).json({ 
      error: "Backend Error", 
      details: error.message 
    });
  }
}
