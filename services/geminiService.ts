
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { NoteType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNoteFromBullets = async (bullets: string, type: NoteType) => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Act as a professional psychologist. Convert the following bullet points into a structured clinical note in ${type} format.
    Keep the tone clinical, objective, and HIPAA-compliant (avoid PII).
    
    Bullet Points:
    ${bullets}
    
    Return the result as a JSON object with the following keys depending on the format:
    For SOAP: s, o, a, p
    For DAP: d, a, p
    For BIRP: b, i, r, p
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            s: { type: Type.STRING },
            o: { type: Type.STRING },
            a: { type: Type.STRING },
            p: { type: Type.STRING },
            d: { type: Type.STRING },
            b: { type: Type.STRING },
            i: { type: Type.STRING },
            r: { type: Type.STRING },
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const suggestProgressSummary = async (noteContent: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Based on this clinical session content, write a one-sentence progress summary for the client's dashboard: "${noteContent}"`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Error generating summary.";
  }
};

export const alignWithGoals = async (noteContent: string, goals: string[]) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Analyze the following clinical note and identify which of the client's treatment goals were addressed in this session.
    Provide a brief clinical rationale for each alignment.
    
    Clinical Note: "${noteContent}"
    Treatment Goals: ${goals.join(', ')}
    
    Return a JSON array of objects with keys: "goal", "addressed" (boolean), and "rationale".
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              addressed: { type: Type.BOOLEAN },
              rationale: { type: Type.STRING }
            },
            required: ["goal", "addressed", "rationale"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Goal Alignment Error:", error);
    return [];
  }
};

export const searchClinicalInfo = async (query: string) => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `You are a clinical research assistant for mental health professionals. Research the following topic: ${query}. Focus on peer-reviewed findings, DSM-5 criteria, or recent clinical guidelines.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw error;
  }
};

export const generateHandout = async (topic: string, focus: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Create a patient psychoeducation handout about "${topic}". Focus specifically on "${focus}". 
  Use a supportive, clear tone. Include 3-5 actionable coping strategies. Use Markdown.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Handout Generation Error:", error);
    return "Failed to generate handout.";
  }
};

export const generateHandoutAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this patient handout clearly and supportively: ${text.substring(0, 1000)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
