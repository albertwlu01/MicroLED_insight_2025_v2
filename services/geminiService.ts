import { GoogleGenAI } from "@google/genai";
import { NewsData, Region, Source } from '../types';

// Initialize the Gemini API client
// Note: process.env.API_KEY is expected to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMicroLEDNews = async (region: Region): Promise<NewsData> => {
  try {
    const prompt = `
      Perform a Google Search to find the absolute latest news, business reports, and technological breakthroughs regarding MicroLED technology specifically in ${region}.
      
      Focus on:
      1. Major manufacturing investments and factory updates.
      2. New product announcements (TVs, AR/VR glasses, automotive displays).
      3. Supply chain partnerships and mass production timelines.
      4. Research breakthroughs in efficiency or mass transfer.

      Provide a comprehensive professional summary of the current landscape in ${region} based on these search results. 
      Structure the response as a clear, readable briefing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No summary available.";
    
    // Extract sources from grounding metadata
    const sources: Source[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            url: chunk.web.uri || "#"
          });
        }
      });
    }

    // Deduplicate sources based on URL
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    return {
      summary: text,
      sources: uniqueSources,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
