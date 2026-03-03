
import { GoogleGenAI } from "@google/genai";

// Use gemini-3-pro-preview for complex reasoning task (aesthetic plan)
// This service provides high-level clinical reasoning for aesthetic treatment paths.
export const getAestheticPlan = async (patient: any, treatments: any[]) => {
  // Always use a named parameter for the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a specialist aesthetic consultant. Review this patient's history and provide a professional treatment plan update:
  Patient: ${JSON.stringify(patient)}
  Past Treatments: ${JSON.stringify(treatments)}
  
  Provide:
  1. Maintenance schedule for existing procedures.
  2. Complementary treatment suggestions (e.g., specific skincare ingredients or laser types).
  3. Safety warnings based on medical history.
  
  Keep it concise, clinical, and high-end clinic tone.`;

  try {
    // Correct method: use ai.models.generateContent directly
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Correct property access: .text instead of .text()
    return response.text || "No insights available for this profile.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Intelligence service currently unavailable.";
  }
};