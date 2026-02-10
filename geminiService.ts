import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
// In a real production environment with Cloudflare Workers, you would move this logic 
// to your worker at /functions/generate to keep the API key hidden.
// For this Admin Panel demo, we implement it directly here to ensure it works immediately.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNewsArticle = async (topic: string): Promise<{ title: string; content: string; excerpt: string }> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are a professional journalist for VELARA, a premium news agency. 
      Write a comprehensive news article about: "${topic}".
      
      Return the response in strictly valid JSON format with the following keys:
      - title: A catchy, professional headline.
      - content: The full article body (approx 300-500 words), formatted with HTML tags (<p>, <h2>, etc.) for readability.
      - excerpt: A short 2-sentence summary for the preview card.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Writing Failed:", error);
    throw new Error("Failed to generate article. Please try again.");
  }
};
