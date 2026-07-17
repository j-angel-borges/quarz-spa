/**
 * GOOGLE APPS SCRIPT - PIPELINE DE NOTIFICACIONES DE RESERVA QUARZ
 * 
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. Abre tu hoja de cálculo en Google Sheets (o crea una nueva).
 * 2. Ve a Extensiones > Apps Script.
 * 3. Borra el código existente y pega este archivo completo.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 * 5. Tipo: "Aplicación web".
 * 6. Ejecutar como: "Yo" (tu cuenta de Google).
 * 7. Quién tiene acceso: "Cualquier persona" (Anyone).
 * 8. Copia la URL generada y pégala en la aplicación web en la constante VITE_APPS_SCRIPT_URL.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var fullName = data.fullName || 'No especificado';
    var companyName = data.companyName || 'No especificada';
    var email = data.email || 'No especificado';
    var day = data.day || 'Sin fecha';
    var time = data.time || 'Sin hora';
    var timestamp = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });

    // 1. Guardar en la hoja de Google Sheets activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está vacía, agregar encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha Registro', 
        'Día Reservado', 
        'Hora Reservada', 
        'Nombre Completo', 
        'Empresa / Hospital', 
        'Correo Electrónico'
      ]);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
    }

    sheet.appendRow([timestamp, day, time, fullName, companyName, email]);

    // 2. Destinatarios obligatorios de la notificación
    var recipients = [
      "mipropiadinastia@gmail.com",
      "angel.borges@quarz.online"
    ].join(",");

    var subject = "🚨 Nueva Reserva Comercial QUARZ: " + companyName + " - " + day + " @ " + time;

    // 3. Plantilla HTML corporativa limpia con acentos dorados
    var htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center; border-bottom: 3px solid #d4af37; }
          .header h1 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }
          .header p { color: #d4af37; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
          .content { padding: 30px; }
          .badge { display: inline-block; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 6px 12px; rounded-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
          .table-data { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table-data td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .label { color: #64748b; font-weight: 600; width: 40%; }
          .value { color: #0f172a; font-weight: bold; }
          .highlight { color: #b88e39; font-family: monospace; font-size: 15px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-t: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>QUARZ Medical Systems</h1>
            <p>Notificación de Reserva Comercial</p>
          </div>
          <div class="content">
            <div className="badge">📍 Prospecto Calificado por Agente IA</div>
            <p style="font-size: 15px; line-height: 1.5; color: #334155;">
              Se ha agendado exitosamente una llamada de evaluación de distribución directa de indumentaria quirúrgica e insumos clínicos.
            </p>
            
            <table class="table-data">
              <tr>
                <td class="label">Día Programado:</td>
                <td class="value highlight">${day}</td>
              </tr>
              <tr>
                <td class="label">Hora de Cita:</td>
                <td class="value highlight">${time}</td>
              </tr>
              <tr>
                <td class="label">Nombre Solicitante:</td>
                <td class="value">${fullName}</td>
              </tr>
              <tr>
                <td class="label">Empresa / Complejo:</td>
                <td class="value">${companyName}</td>
              </tr>
              <tr>
                <td class="label">Correo Profesional:</td>
                <td class="value" style="color: #2563eb;">${email}</td>
              </tr>
              <tr>
                <td class="label">Fecha Registro:</td>
                <td class="value" style="font-size: 12px; color: #64748b;">${timestamp}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            QUARZ AI Engine v3.5 • Proyecto GCP: gen-lang-client-0929068122
          </div>
        </div>
      </body>
      </html>
    `;

    // Envío asíncrono obligatorio del correo electrónico
    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Reserva registrada y correo enviado exitosamente."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
