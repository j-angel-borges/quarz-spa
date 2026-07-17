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

  const { fullName, companyName, email, whatsapp, day, time, appsScriptUrl } = req.body || {};

  if (!fullName || !companyName || !email || !whatsapp) {
    return res.status(400).json({ error: 'Nombre, empresa, correo y WhatsApp son obligatorios.' });
  }

  const payload = {
    fullName,
    companyName,
    email,
    whatsapp,
    day: day || 'Próxima Cita',
    time: time || '11:00 AM',
    timestamp: new Date().toISOString()
  };

  const targetAppsScriptUrl = appsScriptUrl || process.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxWAvO_N4Ycr79zaljl2_uwJ28_jOvDfqH8643eVtqLm6BEZH5rLtkLOvJKIuAX6mw0mw/exec';

  try {
    // Forwarding payload to Google Apps Script Endpoint
    if (targetAppsScriptUrl && !targetAppsScriptUrl.includes('placeholder')) {
      const gRes = await fetch(targetAppsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('Apps Script POST status:', gRes.status);
    }
  } catch (err) {
    console.error('Apps Script forwarding error:', err.message);
  }

  return res.status(200).json({
    status: 'success',
    message: '¡Llamada Agendada! Revisa tu bandeja de entrada',
    data: payload
  });
}
