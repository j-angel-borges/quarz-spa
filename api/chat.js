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
  const userLastMessage = messages[messages.length - 1]?.text || '';
  const lowerText = userLastMessage.toLowerCase().trim();

  // Strict Off-Topic Guardrail Check
  const offTopicKeywords = ['pañal', 'pañales', 'bebé', 'bebe', 'software', 'auto', 'coches', 'comida', 'zapatos', 'televisor', 'juguete'];
  const isOffTopic = offTopicKeywords.some(kw => lowerText.includes(kw));

  if (isOffTopic) {
    return res.status(200).json({
      text: "Nos especializamos exclusivamente en distribución mayorista de indumentaria quirúrgica y material médico crítico. No comercializamos ese producto.",
      isQualified: false,
      triggerBooking: false
    });
  }

  // Conversion Trigger Keyword Check (if user wants to schedule or confirmed qualification)
  const isSchedulingIntent = lowerText.includes('agendar') || lowerText.includes('cita') || lowerText.includes('llamada') || lowerText.includes('comprar insumos') || lowerText.includes('necesitamos batas');
  if (isSchedulingIntent) {
    return res.status(200).json({
      text: "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.",
      isQualified: true,
      triggerBooking: true
    });
  }

  const systemInstruction = `
Eres un capacitado Appointment Setter para distribución mayorista de indumentaria clínica, batas de protección y suministros hospitalarios de alta demanda.

Tus reglas de comportamiento:
1. Tono y Estilo: Profesional, fluido, conciso (máximo 2 líneas por mensaje). Evita muletillas y repeticiones.
2. Si el usuario saluda o pregunta "¿De qué me hablas?", "¿Quién eres?" o muestra dudas: Responde con amabilidad explicando que gestionas el abastecimiento de batas e indumentaria clínica para hospitales y clínicas, y pregúntale qué volumen necesitan.
3. Guardarraíles de nicho: Si preguntan sobre productos fuera de insumos médicos, tu respuesta DEBE ser estrictamente:
"Nos especializamos exclusivamente en distribución mayorista de indumentaria quirúrgica y material médico crítico. No comercializamos ese producto."
4. Gatillo de Conversión: Si el usuario califica como cliente hospitalario interesado, tu respuesta final de cierre DEBE ser EXACTAMENTE:
"Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista."
`;

  try {
    let aiResponseText = '';

    if (apiKey && apiKey.startsWith('AIza')) {
      const ai = new GoogleGenAI({ apiKey });
      const historyPrompt = messages.map(m => `${m.sender === 'user' ? 'Lead' : 'Setter'}: ${m.text}`).join('\n');
      const fullPrompt = `${systemInstruction}\n\nHistorial:\n${historyPrompt}\n\nSetter:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: { temperature: 0.3, maxOutputTokens: 150 }
      });
      aiResponseText = response.text ? response.text.trim() : '';
    } else if (apiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const historyPrompt = messages.map(m => `${m.sender === 'user' ? 'Lead' : 'Setter'}: ${m.text}`).join('\n');
      const fullPrompt = `${systemInstruction}\n\nHistorial:\n${historyPrompt}\n\nSetter:`;

      const gcpRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.3 }
        })
      });

      if (gcpRes.ok) {
        const gcpData = await gcpRes.json();
        aiResponseText = gcpData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      }
    }

    if (aiResponseText) {
      const triggerBooking = aiResponseText.includes("calendario de abajo") || aiResponseText.includes("perfil de distribución directa");
      return res.status(200).json({
        text: aiResponseText,
        isQualified: true,
        triggerBooking: triggerBooking
      });
    }

  } catch (err) {
    console.error("Gemini model error:", err);
  }

  // Dynamic Natural Fallback Engine
  let dynamicResponse = "";
  let triggerBooking = false;

  if (lowerText.includes('de que me hablas') || lowerText.includes('de qué hablas') || lowerText.includes('quien eres') || lowerText.includes('quién eres') || lowerText.includes('hola') || lowerText.includes('que es esto')) {
    dynamicResponse = "Le contacto sobre el abastecimiento de batas e indumentaria de especialidad clínica. Proveemos insumos esterilizados directos a centros de salud. ¿Tienen requerimientos esta semana?";
  } else if (lowerText.includes('cuanto') || lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('catalogo')) {
    dynamicResponse = "Manejamos precios escalonados por volumen mayorista. Para presentarle nuestro catálogo institucional, coordinemos una breve reunión con nuestro equipo.";
  } else if (lowerText.includes('si') || lowerText.includes('sí') || lowerText.includes('clínica') || lowerText.includes('hospital') || lowerText.includes('compramos') || lowerText.includes('requerimos')) {
    dynamicResponse = "Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.";
    triggerBooking = true;
  } else {
    dynamicResponse = "Para evaluar su volumen de compra e indumentaria clínica requerida, ¿a qué centro o institución médica representa?";
  }

  return res.status(200).json({
    text: dynamicResponse,
    isQualified: true,
    triggerBooking: triggerBooking
  });
}
