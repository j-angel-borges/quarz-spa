import { GoogleAuth } from 'google-auth-library';
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

  const apiKey = process.env.GCP_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GCP_API_KEY || '';
  const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0929068122';

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
    let aiResponseText = '';

    // Strategy 1: Google AI Studio Key (AIzaSy...)
    if (apiKey && apiKey.startsWith('AIza')) {
      const ai = new GoogleGenAI({ apiKey });
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
      aiResponseText = response.text ? response.text.trim() : '';
    } 

    // Strategy 2: Vertex AI on GCP with GoogleAuth ADC / OAuth Token
    if (!aiResponseText) {
      try {
        const auth = new GoogleAuth({
          scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        if (token && token.token) {
          const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent`;
          
          const contents = messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));

          const vertexRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200
              }
            })
          });

          if (vertexRes.ok) {
            const vertexData = await vertexRes.json();
            aiResponseText = vertexData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          }
        }
      } catch (authErr) {
        console.log('Vertex Auth fallback:', authErr.message);
      }
    }

    // Return real AI response if generated
    if (aiResponseText) {
      const triggerBooking = aiResponseText.includes("calendario de abajo") || aiResponseText.includes("perfil de distribución directa");
      return res.status(200).json({
        text: aiResponseText,
        isQualified: true,
        triggerBooking: triggerBooking
      });
    }

  } catch (err) {
    console.error("Gemini live execution error:", err);
  }

  // Fallback in case of unexpected network issue
  const userLastMessage = messages[messages.length - 1]?.text || '';
  const lowerText = userLastMessage.toLowerCase().trim();

  let fallbackText = "Hola, le hablo de la división de distribución de indumentaria clínica e insumos médicos para clínicas y hospitales. ¿Tienen necesidad de abastecimiento actualmente?";
  let triggerBooking = false;

  if (lowerText.includes('agendar') || lowerText.includes('cita') || lowerText.includes('llamada')) {
    fallbackText = "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.";
    triggerBooking = true;
  }

  return res.status(200).json({
    text: fallbackText,
    isQualified: true,
    triggerBooking: triggerBooking
  });
}
