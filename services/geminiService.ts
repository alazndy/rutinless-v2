import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PLACES } from "../constants";
import { Place, UserStats, Category } from "../types";

// Helper to get client with current key from environment
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSmartRecommendations = async (
  prompt: string
): Promise<string[]> => {
  const ai = getClient();
  
  // We send a simplified version of the DB to save tokens and provide context
  const dbContext = MOCK_PLACES.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    tags: p.tags,
    description: p.description
  }));

  const sysInstruction = `
    Sen İstanbul'da yaşayan yerel bir rehbersin.
    Aşağıdaki mekan veritabanını kullanarak, kullanıcının isteğine en uygun mekanları seç.
    
    Veritabanı: ${JSON.stringify(dbContext)}
    
    Sadece mekan ID'lerinden oluşan bir JSON Array döndür. Örnek: ["1", "3"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const ids = JSON.parse(text);
    return Array.isArray(ids) ? ids : [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const getCharacterTag = async (
  visitedIds: string[]
): Promise<Partial<UserStats>> => {
  if (visitedIds.length === 0) return {};

  const ai = getClient();
  
  const visitedPlaces = MOCK_PLACES.filter(p => visitedIds.includes(p.id));
  const summary = visitedPlaces.map(p => p.category).join(', ');

  const sysInstruction = `
    Kullanıcının ziyaret ettiği mekan kategorilerine bakarak ona eğlenceli bir 'Rutin Kırıcı' unvanı ver.
    Ve onu motive edecek kısa bir cümle yaz.
    
    Çıktı JSON formatında olsun: { "characterTitle": "Unvan", "characterQuote": "Söz" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ziyaret edilen kategoriler: ${summary}`,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterTitle: { type: Type.STRING },
            characterQuote: { type: Type.STRING }
          },
          required: ["characterTitle", "characterQuote"]
        }
      }
    });

    const text = response.text;
    if (!text) return {};

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Character Error:", error);
    return {};
  }
};