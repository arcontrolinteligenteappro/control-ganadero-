
import { GoogleGenAI, Type } from "@google/genai";
import { Animal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const estimateValue = async (animal: Partial<Animal>) => {
  try {
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
    // Limpiar posibles bloques de código si el modelo los añade por error
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error estimating value:", error);
    return {
      minPrice: 0,
      maxPrice: 0,
      currency: "USD",
      justification: "Error al obtener estimación. Verifique su conexión."
    };
  }
};

export const getHealthRecommendation = async (animal: Animal, healthLogs: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como experto veterinario IA, analiza el historial de salud de este animal:
      Animal: ${animal.breed}, ${animal.age} meses, ${animal.weight}kg.
      Estado actual: ${animal.healthStatus}.
      Historial médico reciente: ${JSON.stringify(healthLogs)}
      
      Proporciona una recomendación concisa de manejo sanitario, mencione vacunas próximas o posibles alertas de riesgo epidemiológico en la región.`,
    });
    return response.text || "No se pudo generar una recomendación en este momento.";
  } catch (error) {
    console.error("Error getting health recommendation:", error);
    return "Error al conectar con el servicio de análisis veterinario.";
  }
};
