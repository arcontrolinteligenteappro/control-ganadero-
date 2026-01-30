
import { GoogleGenAI, Type } from "@google/genai";
import { Animal } from "../types";

export const estimateValue = async (animal: Partial<Animal>) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estima el valor comercial actual para un animal con las siguientes características:
      Tipo: ${animal.type}
      Raza: ${animal.breed}
      Edad: ${animal.age} meses
      Peso: ${animal.weight} kg
      Categoría: ${animal.category}
      Región: ${animal.location || 'Sudamérica'}
      
      Proporciona un rango de precio sugerido en USD y una breve justificación basada en tendencias de mercado reales.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            justification: { type: Type.STRING }
          },
          required: ["minPrice", "maxPrice", "currency", "justification"]
        }
      }
    });
    
    const text = response.text || "{}";
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error estimating value:", error);
    return { minPrice: 0, maxPrice: 0, currency: "USD", justification: "Error al obtener estimación." };
  }
};

export const getGeneralConsultation = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un experto consultor agropecuario para la plataforma AR CONTROL GANADERO.
      Responde de forma profesional, técnica y práctica a la siguiente consulta:
      
      Consulta: "${query}"
      
      IMPORTANTE: Si la consulta es médica, indica que es una sugerencia de referencia. 
      Cubre temas de: Alimentación, Sanidad, Genética, Manejo de Potreros o Suplementación.`,
    });
    return response.text || "Lo siento, no pude procesar tu consulta en este momento.";
  } catch (error) {
    console.error("Error en consulta libre IA:", error);
    return "Error de conexión con el servidor de inteligencia.";
  }
};

export const analyzeHealthProblem = async (imageB64: string | null, description: string, animalInfo: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [{ text: `Actúa como un consultor veterinario experto para AR CONTROL GANADERO. 
      Analiza el siguiente problema de salud en un animal.
      Información del animal: ${animalInfo}
      Descripción del usuario: ${description}
      
      IMPORTANTE: Tu respuesta debe ser una sugerencia de referencia. No sustituyes a un veterinario real.
      Incluye:
      1. Diagnóstico presuntivo (referencial).
      2. Medicamento sugerido.
      3. Dosis recomendada.
      4. Nivel de urgencia.
      
      Formato de respuesta: JSON plano.` }];

    if (imageB64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageB64.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            medication: { type: Type.STRING },
            dosage: { type: Type.STRING },
            urgency: { type: Type.STRING },
            disclaimer: { type: Type.STRING }
          },
          required: ["diagnosis", "medication", "dosage", "urgency"]
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("Error en consulta IA:", error);
    throw error;
  }
};
