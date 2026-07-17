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

  const { fullName, companyName, email, whatsapp, day, time } = req.body || {};

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

  // URL del despliegue vigente (@3) del Apps Script de notificaciones.
  // NO se acepta una URL enviada por el cliente (evita redirección maliciosa de reservas)
  // ni se usa VITE_APPS_SCRIPT_URL (apuntaba a un despliegue V1 ya eliminado).
  const targetAppsScriptUrl = (process.env.APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbzx9cMZXHiLt_FLVGinmWltBZrO3JjWCxiVxuBgK4cQJYxCMKaBVSIzW1wUXRMr_sVS1g/exec').trim();

  try {
    const gRes = await fetch(targetAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    const gText = await gRes.text();
    console.log('Apps Script status:', gRes.status, gText.slice(0, 200));

    if (!gRes.ok || !gText.includes('"status":"success"')) {
      throw new Error(`Apps Script respondió ${gRes.status}: ${gText.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('Apps Script forwarding error:', err.message);
    return res.status(502).json({
      status: 'error',
      message: 'La reserva no pudo registrarse. Intenta nuevamente en unos minutos.'
    });
  }

  return res.status(200).json({
    status: 'success',
    message: '¡Llamada Agendada! Revisa tu bandeja de entrada',
    data: payload
  });
}
