export const emailVerificarPagoAdmin = (data:{
  monto:number;
  formaPago: string;
  fechaCobro: Date;
  fechaInicioPago: Date;
  fechaFinPago: Date;
  numeroMembresia:string
  fechaInicioMembresia: Date;
  fechaFinMembresia: Date;
  direccionPrevimed: string;
  telefonoPrevimed: string;
  nombreAdmin: string;
  nombreTitular:string;
}) => 
`
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de pago</title>
  <style>
    body { margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI', Roboto, sans-serif; }
    .wrapper { width:100%; table-layout:fixed; background-color:#f8fafc; padding:20px 0; }
    .main { background:#ffffff; margin:0 auto; width:100%; max-width:600px; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
    .header {padding:20px; text-align:center;}
    .header h1 { margin:0; font-size:22px; }
    .logo { max-width:140px; height:auto; }
    .content { padding:24px; color:#1f2937; }
    h2 { color:#111827; font-size:18px; margin-bottom:10px; }
    p { margin:0 0 10px; line-height:1.5; font-size:15px; }
    .card { background:#f9fafb; border:1px solid #e5e7eb; padding:16px; border-radius:8px; margin-top:12px; }
    .label { font-weight:600; color:#374151; }
    .value { color:#111827; }
    .highlight { color:#2563eb; font-weight:600; }
    .footer { padding:16px; text-align:center; font-size:13px; color:#9ca3af; }
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
          <h1>Nuevo pago realizado</h1>
          <p>Hola <strong>${data.nombreAdmin}</strong>,</p>
          <p>Se ha realizado un nuevo pago, por favor verifica para evitar la suspención de los servicios al usuario y sus beneficiarios.</p>
          <h3>Detalles del pago.</h3>

          <div class="card">
          <p><span class="label">Forma de pago:</span> <span class="value">${data.formaPago}</span></p>
          <p><span class="label">Monto:</span> <span class="value">${data.monto}</span></p>
          <p><span class="label">Fecha de cobro:</span> <span class="value">${data.fechaCobro}</span></p>
          <p><span class="label">Inicio:</span> <span class="value">${data.fechaInicioPago}</span></p>
          <p><span class="label">Fin:</span> <span class="value">${data.fechaFinPago}</span></p>
          <p><strong>Detalles de membresía</strong></p>
          <p><span class="label">Nombre del titular:</span> <span class="value highlight">${data.nombreTitular}</span></p>
          <p><span class="label">Número de membresía:</span> <span class="value highlight">${data.numeroMembresia}</span></p>
          <p><span class="label">Inicio de membresía:</span> <span class="value">${data.fechaInicioMembresia}</span></p>
          <p><span class="label">Fin de membresía:</span> <span class="value">${data.fechaFinMembresia}</span></p>
          </div>
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