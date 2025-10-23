export const emailVisitaPaciente = (data: {
  nombrePaciente: string
  nombreMedico: string
  especialidadMedico: string
  fechaVisita: string
  horaVisita: string
  descripcion: string
  nombreClinica: string
  direccionPrevimed: string
  telefonoPrevimed: string
  barrio: string
  direccionVisita: string
}) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Cita Médica</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fa; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#11998e,#38ef7d); padding:40px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:30px; font-weight:600;">Visita Confirmada</h1>
              <p style="margin:8px 0 0; color:#e0ffe0; font-size:18px;">Tu cita médica ha sido programada con éxito</p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 20px; font-size:20px;">Hola <strong>${data.nombrePaciente}</strong>,</p>
              <p style="margin:0 0 25px; color:#555; font-size:17px; line-height:1.5;">
                Te confirmamos tu visita médica. A continuación encontrarás los detalles:
              </p>

              <!-- Fecha y hora -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#11998e,#38ef7d); border-radius:8px; margin-bottom:25px;">
                <tr>
                  <td style="padding:28px; text-align:center;">
                    <p style="margin:0 0 8px; color:#ffffff; font-size:13px; text-transform:uppercase; letter-spacing:0.8px;">Tu visita es el</p>
                    <h2 style="margin:0; color:#ffffff; font-size:28px; font-weight:700;">${data.fechaVisita}</h2>
                    <p style="margin:4px 0 0; color:#e0ffe0; font-size:18px; font-weight:500;">${data.horaVisita}</p>
                  </td>
                </tr>
              </table>

              <!-- Médico -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:25px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px; color:#11998e; font-size:18px; font-weight:600;">Tu médico</h3>
                    <p style="margin:0; font-size:16px; font-weight:600; color:#111;">Dr./Dra. ${data.nombreMedico}</p>
                    <p style="margin:4px 0 0; color:#666; font-size:15px;">${data.especialidadMedico}</p>
                  </td>
                </tr>
              </table>

              <!-- Detalles de la visita -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #38ef7d; border-radius:8px; overflow:hidden; margin-bottom:25px;">
                <tr>
                  <td style="background-color:#11998e; padding:14px 20px;">
                    <h2 style="margin:0; color:#fff; font-size:19px; font-weight:600;">Detalles de la Visita</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="10" cellspacing="0">
                      <tr>
                        <td style="width:120px; color:#666; font-size:15px; vertical-align:top;"><strong>Motivo:</strong></td>
                        <td style="font-size:15px; color:#111; line-height:1.5;">${data.descripcion}</td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Dirección:</strong></td>
                        <td style="font-size:15px; color:#111;">
                          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.direccionVisita}, ${data.barrio}`)}"
                             style="color:#11998e; text-decoration:none; font-weight:600;">
                            ${data.direccionVisita}, ${data.barrio}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Recomendaciones -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5; border-radius:8px; margin-bottom:25px; border:1px solid #d1fae5;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px; color:#059669; font-size:18px; font-weight:600;">Recomendaciones</h3>
                    <ul style="margin:0; padding-left:20px; color:#333; font-size:15px; line-height:1.7;">
                      <li>Permanece disponible a la hora programada.</li>
                      <li>Ten tu documento de identidad a la mano.</li>
                      <li>Prepara tus exámenes o historia clínica si los tienes.</li>
                      <li>Ten una lista de los medicamentos que usas.</li>
                      <li>Anota las dudas que quieras resolver con tu médico.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Contacto -->
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">
              <p style="margin:0; color:#555; font-size:15px; line-height:1.6; text-align:center;">
                Si necesitas cancelar o reprogramar tu visita, contáctanos al 
                <a href="tel:${data.telefonoPrevimed}" style="color:#11998e; text-decoration:none; font-weight:600;">${data.telefonoPrevimed}</a><br>
                o visítanos en <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.direccionPrevimed)}" 
                style="color:#11998e; text-decoration:none; font-weight:600;">${data.direccionPrevimed}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:25px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="margin:0; color:#999; font-size:12px;">© ${new Date().getFullYear()} ${data.nombreClinica}. Todos los derechos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
