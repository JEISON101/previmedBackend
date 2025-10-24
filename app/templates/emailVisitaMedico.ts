export const emailVisitaMedico = (data: {
  nombreMedico: string
  nombrePaciente: string
  emailPaciente: string
  telefonoPaciente: string
  fechaVisita: string
  horaVisita: string
  descripcion: string
  barrio: string
  direccionVisita: string
}) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Visita Asignada</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea,#764ba2); padding:35px 25px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:600;">Nueva Visita Asignada</h1>
              <p style="margin:8px 0 0; color:#e0e7ff; font-size:16px;">PREVIMED S.A.S</p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 20px; font-size:20px;">Estimado/a <strong>Dr./Dra. ${data.nombreMedico}</strong>,</p>
              <p style="margin:0 0 25px; color:#555; font-size:17px; line-height:1.5;">
                Se ha programado una nueva visita médica. A continuación los detalles:
              </p>

              <!-- Información del paciente -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:8px; margin-bottom:25px; border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:20px;">
                    <h2 style="margin:0 0 15px; color:#667eea; font-size:19px; font-weight:600;">Información del Paciente</h2>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="width:120px; color:#666; font-size:15px; vertical-align:top;"><strong>Nombre:</strong></td>
                        <td style="font-size:15px; color:#111;">${data.nombrePaciente}</td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Correo:</strong></td>
                        <td><a href="mailto:${data.emailPaciente}" style="color:#667eea; text-decoration:none; font-size:15px;">${data.emailPaciente}</a></td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Teléfono:</strong></td>
                        <td><a href="tel:${data.telefonoPaciente}" style="color:#667eea; text-decoration:none; font-size:15px;">${data.telefonoPaciente}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Detalles de la visita -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #667eea; border-radius:8px; overflow:hidden; margin-bottom:25px;">
                <tr>
                  <td style="background-color:#667eea; padding:14px 20px;">
                    <h2 style="margin:0; color:#fff; font-size:19px; font-weight:600;">Detalles de la Visita</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="10" cellspacing="0">
                      <tr>
                        <td style="width:120px; color:#666; font-size:15px; vertical-align:top;"><strong>Fecha:</strong></td>
                        <td style="font-size:15px; color:#111; font-weight:500;">${data.fechaVisita}</td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Hora:</strong></td>
                        <td style="font-size:15px; color:#111; font-weight:500;">${data.horaVisita}</td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Dirección:</strong></td>
                        <td style="font-size:15px; color:#111; font-weight:500;">
                          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.direccionVisita}, ${data.barrio}`)}" 
                             style="color:#667eea; text-decoration:none;">
                            ${data.direccionVisita}, ${data.barrio}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#666; font-size:15px; vertical-align:top;"><strong>Motivo:</strong></td>
                        <td style="font-size:15px; color:#111; line-height:1.5;">${data.descripcion}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botón -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td align="center">
                    <a href="#" style="display:inline-block; background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; text-decoration:none; padding:12px 36px; border-radius:6px; font-size:15px; font-weight:600;">
                      Ver en el Sistema
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:25px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px; color:#777; font-size:12px;">Este es un correo automático, por favor no responder.</p>
              <p style="margin:0; color:#999; font-size:12px;">© ${new Date().getFullYear()} PREVIMED S.A.S. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
