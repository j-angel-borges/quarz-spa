import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
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

  const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0929068122';
  const location = process.env.GCP_LOCATION || 'us-central1';

  const systemInstruction = `
Eres un capacitado y empático Appointment Setter profesional para una distribuidora mayorista de indumentaria clínica, batas esterilizadas e insumos hospitalarios.

REGLAS DE INTERACCIÓN CON EL USUARIO:
1. Tono y Estilo: Inteligente, fluido, humano y corporativo. Responde siempre en máximo 2 o 3 líneas con lenguaje natural.
2. Adaptabilidad Conversacional: Si el usuario muestra confusión, saluda o pregunta cosas como "¿De qué me hablas?", "¿Quién eres?", "¿Qué hacen?" o cambia de tema de manera informal, responde de forma 100% fluida y natural explicando que te comunicas para atender el abastecimiento de indumentaria clínica e insumos médicos de su centro hospitalario o clínica.
3. Guardarraíles de Nicho: Si el usuario pregunta por productos completamente ajenos (ej. pañales, ropa de bebé, automóviles, software, alimentos), aclara con total cortesía: "Nos especializamos exclusivamente en distribución mayorista de indumentaria clínica e insumos hospitalarios. No comercializamos ese producto." y reorienta amablemente.
4. Cierre y Agendamiento: Cuando el usuario confirme que representa a un hospital, clínica o central médica con necesidad de insumos o pida agendar una reunión, incluye al final el mensaje de cierre:
"Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista."
`;

  try {
    // Direct Google Cloud Platform (GCP) Vertex AI Configuration
    const options = {
      vertexai: true,
      project: projectId,
      location: location
    };

    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      try {
        options.credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);
      } catch (e) {
        console.error("Error parsing GCP_SERVICE_ACCOUNT_KEY:", e.message);
      }
    } else if (process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
      options.credentials = {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
      };
    } else if (process.env.GCP_API_KEY) {
      options.apiKey = process.env.GCP_API_KEY.trim();
    }

    const ai = new GoogleGenAI(options);

    const contents = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });

    const aiResponseText = response.text ? response.text.trim() : '';

    if (aiResponseText) {
      const triggerBooking = aiResponseText.includes("calendario de abajo") || aiResponseText.includes("perfil de distribución directa");
      return res.status(200).json({
        text: aiResponseText,
        isQualified: true,
        triggerBooking: triggerBooking
      });
    }

  } catch (err) {
    console.error("GCP Vertex AI Execution Error:", err.message);
  }

  // Natural Fallback Engine if GCP API credentials are incomplete on Vercel
  const userLastMessage = messages[messages.length - 1]?.text || '';
  const lowerText = userLastMessage.toLowerCase().trim();

  let fallbackText = "Le contacto sobre el abastecimiento de batas e indumentaria clínica. Proveemos insumos esterilizados directos a centros de salud. ¿Tienen requerimientos esta semana?";
  let triggerBooking = false;

  if (lowerText.includes('de que me hablas') || lowerText.includes('de qué hablas') || lowerText.includes('quien eres') || lowerText.includes('quién eres') || lowerText.includes('hola') || lowerText.includes('que es esto')) {
    fallbackText = "Le escribo de la división de distribución de indumentaria clínica e insumos médicos para clínicas y hospitales. ¿En su centro de salud tienen necesidad de insumos actualmente?";
  } else if (lowerText.includes('agendar') || lowerText.includes('cita') || lowerText.includes('llamada') || lowerText.includes('comprar')) {
    fallbackText = "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.";
    triggerBooking = true;
  }

  return res.status(200).json({
    text: fallbackText,
    isQualified: true,
    triggerBooking: triggerBooking
  });
}
