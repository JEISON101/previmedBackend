export const emailBienvenidaTitular = (data:{
  nombre:string;
  segundoNombre?:string;
  apellido:string;
  segundoApellido?:string;
  direccionPrevimed:string;
  telefonoPrevimed:string;
  beneficiarios:any[];
}) => 
`
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a PREVEIMED S.A.S</title>
  <style>
    body { margin:0; padding:0; background-color:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { width:100%; table-layout:fixed; background-color:#f3f4f6; padding:20px 0; }
    .main { background:#ffffff; margin:0 auto; width:100%; max-width:600px; border-radius:8px; overflow:hidden; }
    .header { padding:20px; text-align:center; }
    .logo { max-width:140px; height:auto; }
    .content { padding:24px; color:#1f2937; }
    h1 { margin:0 0 12px 0; font-size:20px; color:#0f172a; }
    p { margin:0 0 12px 0; line-height:1.5; font-size:15px; }
    .card { background:#f8fafc; border:1px solid #e6eef6; padding:14px; border-radius:6px; margin:12px 0; }
    .muted { color:#6b7280; font-size:13px; }
    .button-wrap { text-align:center; margin:18px 0; }
    .btn { display:inline-block; text-decoration:none; padding:12px 20px; border-radius:6px; font-weight:600; border:1px solid #2563eb; }
    .btn-primary { background:#2563eb; color:#ffffff; }
    .btn-outline { background:#ffffff; color:#2563eb; }
    .small-list { margin:8px 0 0 0; padding:0; list-style:none; }
    .small-list li { margin:6px 0; font-size:14px; }
    .footer { padding:16px; text-align:center; font-size:13px; color:#94a3b8; }
    @media (max-width:420px){ .content{padding:16px;} h1{font-size:18px;} }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <img class="logo" src="https://res.cloudinary.com/dudqqzt1k/image/upload/v1761360937/PREVIMED_Full_Color_zwphjh.png" alt="PREVIMED S.A.S" />
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1>Bienvenido/a a PREVIMED S.A.S, ${data.nombre} ${data.segundoNombre?? ''} ${data.apellido} ${data.segundoApellido??''}</h1>
          <p>Tu registro ha sido un exito. Aquí tienes la información básica y los documentos importantes que debes conocer.</p>

          <div class="card">
            <strong>Beneficiarios registrados</strong>
            <ul class="small-list">
              ${data.beneficiarios.length > 0?
                (data.beneficiarios.map((b)=>(
                  `
                  <ul>
                  <li>
                  <p>
                  Nombre Completo: ${b.usuario.nombre} ${b.usuario.segundoNombre??''} ${b.usuario.apellido} ${b.usuario.segundoApellido??''}
                  </p>
                  <p>Documento: ${b.usuario.numero_documento}</p>
                  </li>
                  </ul>
                  `
                  ))
                ):
                (
                  `<p>No se registaron beneficiarios.</p>`
                )
              }
            </ul>
          </div>

          <p>Descarga y revisa los documentos oficiales a continuación. Si tienes preguntas, responde a este correo o visita tu panel en la aplicación.</p>

          <div class="button-wrap">
            <a class="btn btn-outline" href="https://res.cloudinary.com/dudqqzt1k/image/upload/v1761366273/Terminos_y_Condiciones_PREVIMED_mkxon0.pdf" target="_blank">Términos y condiciones</a>
          </div>
          <p>Aunque ya se realizó exitosamente tu registro dentro de la aplicación, aun no puedes hacer uso de nuestros servicios.</p>
          <p>Una vez confirmado tu pago te llegará un correo electronico y se activarán los servicios para que puedas disfrutar de ellos.</p>
          <div style=" border: 1px solid #e88907; border-radius: 12px; background-color: #fffaf5; padding: 18px 22px; font-family: 'Segoe UI', Roboto, sans-serif; color: #8a4d00;">
            <p style="margin: 0; font-weight: 600; font-size: 16px; color: #e88907;">⚠ Importante</p>
            <p style="margin: 6px 0 0; line-height: 1.5; font-size: 14px;">
              Si en un plazo de <strong>48 horas</strong> no se ha confirmado tu pago, por favor comunícate con nosotros.
            </p>
          </div>
          <p>Recibiste este correo porque te registraste en PREVIMED S.A.S. Si no autorizaste tu registro en la plataforma contactanos de inmediato.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p class="muted">Dirección: ${data.direccionPrevimed} · Cel: ${data.telefonoPrevimed}</p>
          <p style="margin:0; color:#999; font-size:12px;">© ${new Date().getFullYear()} PREVIMED S.A.S. Todos los derechos reservados.</p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html> 
`