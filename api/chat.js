import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Payload must contain a messages array.' });
  }

  const apiKey = process.env.GCP_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GCP_API_KEY;
  const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0929068122';

  const userLastMessage = messages[messages.length - 1]?.text || '';
  const lowerText = userLastMessage.toLowerCase();

  // Check off-topic guardrails locally for immediate compliance if requested
  const offTopicKeywords = ['pañal', 'pañales', 'bebé', 'bebe', 'software', 'auto', 'coches', 'comida', 'zapatos', 'televisor', 'juguete'];
  const isOffTopic = offTopicKeywords.some(kw => lowerText.includes(kw));

  if (isOffTopic) {
    return res.status(200).json({
      text: "Nos especializamos exclusivamente en distribución mayorista de indumentaria quirúrgica y material médico crítico. No comercializamos ese producto.",
      isQualified: false,
      triggerBooking: false
    });
  }

  // System instructions for Appointment Setter
  const systemInstruction = `
Eres un Appointment Setter élite para una distribuidora de indumentaria clínica, bisturís, mascarillas y suministros hospitalarios.
Tu objetivo es calificar al lead en menos de 4 interacciones y forzar el agendamiento de una llamada comercial.
Tono: Profesional, directo, sumamente conciso (máximo 2 líneas por mensaje).

GUARDARRAÍLES DE NICHO:
Si el usuario menciona tópicos ajenos (ej. pañales, ropa de bebé, software, etc.), tu respuesta DEBE ser estrictamente:
"Nos especializamos exclusivamente en distribución mayorista de indumentaria quirúrgica y material médico crítico. No comercializamos ese producto."

GATILLO DE CONVERSIÓN:
Si el cliente es adecuado (representa una clínica, hospital o central de compras que requiere suministros quirúrgicos/médicos masivos), tu mensaje de cierre DEBE ser EXACTAMENTE:
"Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista."
`;

  // Fallback AI simulation if API Key is not set in local environment
  if (!apiKey) {
    let mockResponse = "";
    let triggerBooking = false;

    // Count user turns
    const userTurns = messages.filter(m => m.sender === 'user').length;

    if (userTurns >= 3 || lowerText.includes('agendar') || lowerText.includes('comprar') || lowerText.includes('desabastecimiento') || lowerText.includes('hospital') || lowerText.includes('clinica') || lowerText.includes('quirúrgica')) {
      mockResponse = "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.";
      triggerBooking = true;
    } else {
      mockResponse = "¿Con qué tipo de hospital o clínica trabajan actualmente y qué volumen semanal de indumentaria quirúrgica o bisturís requieren?";
    }

    return res.status(200).json({
      text: mockResponse,
      isQualified: true,
      triggerBooking: triggerBooking
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Formatting history for Google Gen AI SDK
    const historyPrompt = messages.map(m => `${m.sender === 'user' ? 'Lead' : 'Setter'}: ${m.text}`).join('\n');
    const prompt = `${systemInstruction}\n\nHistorial de conversación:\n${historyPrompt}\n\nSetter (responde de forma ultra concisa, máx 2 líneas):`;

    const modelName = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 150
      }
    });

    const responseText = response.text ? response.text.trim() : "Nos especializamos en distribución mayorista de indumentaria quirúrgica y material médico. ¿Deseas agendar una llamada?";
    const triggerBooking = responseText.includes("Selecciona un bloque en el calendario de abajo") || responseText.includes("perfil de distribución directa");

    return res.status(200).json({
      text: responseText,
      projectId: projectId,
      isQualified: true,
      triggerBooking: triggerBooking
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Fallback response on API error so interaction doesn't break
    let fallbackText = "Entendido. Para evaluar su volumen y requerimientos de insumos, seleccionemos un horario con el especialista.";
    if (userLastMessage.length > 5) {
      fallbackText = "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.";
    }

    return res.status(200).json({
      text: fallbackText,
      triggerBooking: true,
      error: error.message
    });
  }
}
