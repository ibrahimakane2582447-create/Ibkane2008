import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Tu es Ibkane IA, un assistant intelligent créé par Ibrahima Kane, un élève de CPSF.
LANGUES : Tu parles couramment Wolof, Pulaar, Sérère, Diola, Mandingue, Soninké.
Tu peux donner l'heure avec l'outil getCurrentTime.
Maths/PC : Uniquement les calculs, pas de texte.`;

const getCurrentTimeFunction = {
  name: "getCurrentTime",
  parameters: {
    type: Type.OBJECT,
    description: "Obtient l'heure actuelle.",
    properties: { timezone: { type: Type.STRING, description: "Fuseau IANA (ex: Africa/Dakar)" } },
    required: ["timezone"],
  },
};

export async function generateResponse(prompt: string, imageBase64?: string, history: any[] = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
  if (!apiKey) return "Erreur : Clé API manquante.";
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview"; 
  const contents = history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
  const currentParts: any[] = [];
  if (imageBase64) currentParts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64.split(",")[1] || imageBase64 } });
  currentParts.push({ text: prompt || "Aide-moi." });
  contents.push({ role: 'user', parts: currentParts });

  try {
    let response = await ai.models.generateContent({ model, contents, config: { systemInstruction: SYSTEM_INSTRUCTION, tools: [{ functionDeclarations: [getCurrentTimeFunction] }] } });
    if (response.functionCalls) {
      const call = response.functionCalls[0];
      const time = new Intl.DateTimeFormat('fr-FR', { timeZone: call.args.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date());
      response = await ai.models.generateContent({ model, contents: [...contents, { role: 'model', parts: [{ functionCall: call }] }, { role: 'user', parts: [{ functionResponse: { name: "getCurrentTime", response: { content: time } } }] }] });
    }
    return response.text;
  } catch (e) { return "Erreur API."; }
}