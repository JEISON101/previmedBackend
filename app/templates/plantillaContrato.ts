export const plantillaContrato = (data:{
  direccionPrevimed: string;
  telefonoPrevimed: string;
  beneficiarios: any[];
  titularNombre: string;
  titularEmail: string;
  titularDocumento: string;
  membresia: string;
}) => 
`
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contrato - PREVIMED S.A.S</title>
  <style>
    @page {
      size: A4;
      margin: 30mm;
    }
    body {
      font-family: 'Times New Roman', serif;
      color: #000;
      font-size: 12pt;
      line-height: 1.6;
      position: relative;
    }
    .watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.2;
      background: url('https://res.cloudinary.com/dudqqzt1k/image/upload/v1761360937/PREVIMED_Full_Color_zwphjh.png') center center no-repeat;
      background-size: 70%;
    }
    h1, h2, h3 {
      text-align: center;
      margin: 12px 0;
    }
    h1 { font-size: 18pt; }
    h2 { font-size: 14pt; }
    p {
      text-align: justify;
      margin: 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    td {
      vertical-align: top;
      padding: 4px;
    }
    .label {
      width: 180px;
      font-weight: bold;
    }
    ul {
      margin: 4px 0 4px 20px;
      padding: 0;
    }
    .signature {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .sign-line {
      border-top: 1px solid #000;
      margin-top: 60px;
      text-align: center;
      width: 40%;
    }
    footer {
      text-align: center;
      font-size: 10pt;
      margin-top: 40px;
      color: #444;
    }
  </style>
</head>
<body>
  <div class="watermark"></div>

  <h1>CONTRATO DE AFILIACIÓN PERSONAS NATURALES, PERSONAS JURÍDICAS Y CONVENIOS
    TÉRMINOS DEL CONTRATO PARA LA PRESTACIÓN DEL SERVICIO DE MEDICINA GENERAL EN CASA.</h1>
  <p style="text-align:center; font-style:italic;">PREVIMED S.A.S · Fecha: ${new Date().getDate()}</p>

  <h2>Datos de las partes</h2>
  <table>
    <tr>
      <td class="label">Prestador:</td>
      <td>PREVIMED S.A.S<br>NIT: 123456<br>Dirección: ${data.direccionPrevimed}</td>
    </tr>
    <tr>
      <td class="label">Titular:</td>
      <td>${data.titularNombre}<br>Documento: ${data.titularDocumento}<br>Email: ${data.titularEmail}</td>
    </tr>
    <tr>
      <td class="label">Número de membresía:</td>
      <td>${data.membresia}</td>
    </tr>
  </table>

  <h2>Beneficiarios a cargo</h2>
  ${data.beneficiarios.length > 0?
    (data.beneficiarios.map((b)=>(
      `
      <ul>
      <li>
      <p>
      Nombre Completo: ${b.usuario.nombre} ${b.usuario.segundoNombre? b.usuario.segundoNombre:''} ${b.usuario.apellido} ${b.usuario.segundoApellido? b.usuario.segundoApellido : ''}
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

  <h2>CLAUSULAS CONTRACTUALES</h2>

  <h3>PRIMERA. OBJETO DEL CONTRATO</h3>
  <p>"PREVIMED TU MEDICO EN CASA" S.A.S., que en lo sucesivo, para efectos de este contrato se denominará PREVIMED, prestará a EL USUARIO firmante de este contrato y los BENEFICIARIOS que el determine, que en lo sucesivo se denominarán para este contrato indistintamente como el PACIENTE o el USUARIO, el servicio de atención domiciliaria por parte de médico general, con las características, alcances y condiciones que se especifican en este contrato y conforme a las normas legales y reglamentarias vigentes para el desempeño de la profesión y servicio médico</p>
  
  <h3>SEGUNDA. DESCRIPCION DEL SERVICIO</h3>
  <p>El servicio que brindará PREVIMED comprende: El tratamiento de la situación de salud domiciliaria general previa solicitud del paciente y hasta que la misma haya sido definida por el galeno remitido por PREVIMED y determine los parámetros a seguir, sin que en ningún momento se adquiera la obligación de brindar medicamentos o elementos de carácter clínicos, procedimientos quirúrgicos y suministros o atención por enfermería o la obligación de gestionar procedimientos o suministro de medicamentos ante la EPS que se encuentre afiliado el paciente.</p>
  
  <h3>TERCERA. VIGENCIA DEL CONTRATO</h3>
  <p>La vigencia del presente contrato es de un (1) año, contado a partir del día siguiente a la firma del mismo. En caso de que no se desee renovar, se deberá informar a la contraparte contractual con dentro de los quince días hábiles de anterioridad a su vencimiento, de lo contrario se entenderá renovado por un período igual y así sucesivamente.</p>
  
  <h3>CUARTA. CARACTERISTICAS DEL SERVICIO</h3>
  <p>El servicio de medicina general domiciliaria brindado por PREVIMED, comprende la atención de los requerimientos asistenciales por parte de EL USUARIO del servicio, sin embargo, las partes convienen expresamente que se excluye de la cobertura del presente contrato: A. La petición exclusiva de servicios de elaboración de fórmulas médicas. B. Interpretación exclusiva de exámenes de laboratorio. C. Practica exclusiva de servicios de enfermería tales como, aplicación de Inyecciones y cambio de sondas. D. Los servicios de traslado en ambulancia, así como cualquier otro que no cumpla con las características fijadas en este documento.</p>
  
  <h3>QUINTA. EXCLUSION DE USUARIOS DEL CONTRATO</h3>
  <p>Si se produjeran reiterados requerimientos no justificados por parte de un mismo usuario del servicio, se hiciere mal uso de este, se agrediere fisica o verbalmente a cualquiera de los funcionarios de "PREVIMED", o en general, se realizare cualquier conducta que interfiera con la presentación normal del servicio o cause un perjuicio de cualquier tipo a "PREVIMED", esta podrá proceder a su desafillación y al grupo de usuarios que figuran en este contrato, sin más trámite que la comunicación por escrito, en la cual se dé cuenta del motivo de la terminación del contrato. Se entiende por relterados requerimientos no justificados todas las solicitudes de servicios no convenidos en el presente contrato, así como la petición exclusiva de exámenes de laboratorio, práctica exclusiva de servicios de enfermeria tales como, aplicación de inyecciones y cambio de sondas, la solicitud de servicios en forma reiterada sin que existiere una situación de salud que amerite dicha solicitud, entre otros. PARAGRAFO PRIMERO: La terminación del contrato por cualquiera de las causales aquí indicadas, tendrá efectos a partir del recibo de la comunicación por parte de EL USUARIO que suscribe este contrato. Para tales efectos, la comunicación se entenderá recibida en la dirección informada por EL USUARIO que suscribe este contrato al momento de contratar, o posteriormente, si lo ha informado con el cumplimiento de los requisitos indicados por "PREVIMED". PARAGRAFO SEGUNDO: En caso de terminación de contrato por las razones Indicadas en esta cláusula, se devolverá la tarifa no devengada cuando esta haya sido pagada anticipadamente. Los valores a devolverse contaran por meses y en ningún caso se hará devolución por días. En todo caso, cuando a la terminación del contrato LOS USUARIOS de este contrato no hubleren cumplido un año de afiliación, "PREVIMED TU MEDICO EN CASA" S.A.S. cobrará a título de sanción el cincuenta por clento (50%) de las cuotas que correspondan a los periodos que falten para ajustar el primer año (1) de afiliación.</p>
  
  <h3>SEXTA. ADQUISICION DEL DERECHO DE USUARIO</h3>
  <p>El perfeccionamiento del contrato, la calidad de EL USUARIO y el derecho de servicio de medicina general domiciliaria, comenzará siempre que se cumplan los siguientes requisitos: No se haya rechazado el contrato o la solicitud de Inscripción al mismo por parte de "PREVIMED" dentro de los tres días hábiles siguientes a la firma y presentación del mismo a "PREVIMED" por parte del usuario firmante. Se hayan pagado por el solicitante los valores por tramite de contratación y/o afiliación y la primera cuata mensual, vigente en las listas autorizadas por "PREVIMED TU MEDICO EN CASA" S.A.S. al momento de ser firmado el presente contrato o ser presentada la solicitud por EL USUARIO, según sea el caso. En caso de que "PREVIMED TU MEDICO EN CASA" S.A.S. rechace el contrato la solicitud de inscripción al mismo, el solicitante será contactado por "PREVIMED TU MEDICO EN CASA" S.A.S. para informarle de tal determinación, Información que se podrá dar por cualquier medio, esto es, correo escrito, correo electrónico, via telefónica, entre otros, lo cual deberá realizarse dentro de los tres días hábiles siguientes a la firma y presentación del mismo a "PREVIMED TU MEDICO EN CASA" S.A.S., por parte del solicitante. Para efectos de adquirir el derecho al servicio, son indispensables los siguientes datos, tanto del usuario firmante como para los beneficiarios.</p>

  <h3>SEPTIMA. TARIFA</h3> 
  <p>La tarifa será definida por "PREVIMED TU MEDICO EN CASA" S.A.S. en documento anexo al contrato. Las tarifas serán aumentadas el primero de enero de cada año, en forma unllateral por "PREVIMED TU MEDICO EN CASA" S.A.S. Así mismo, se podrán dar aumentos de la tarifa durante la vigencia del contrato cuando ello fuere necesario por aumento de los costos de los servicios que no se pueden absorber con la tarifa establecida. En todo caso, "PREVIMED TU MEDICO EN CASA" S.A.S. responderá los criterios de determinación de tarifas establecidos en la legislación nacional sobre la materia. "PREVIMED TU MEDICO EN CASA" S.A.S. informará los aumentos de tarifas a EL USUARIO, con antelación mínima de un (1) mes, blen sea mediante comunicación directa a EL USUARIO o mediante publicación de la nueva tarifa en un diario de circulación local. En caso de que EL USUARIO no acepte la tarifa podrá dar por terminado el contrato, para lo cual deberá informar tal determinación por escrito presentado personalmente en las instalaciones de "PREVIMED TU MEDICO EN CASA" S.A.S. o con diligencia de presentación personal ante notario, escrito en el cual deberá consignar los datos que permitan su plena identificación. Esta decisión de dar por terminado el contrato deberá ser manifestada, en la forma indicada, hasta el día quince (15) del mes respectivo, para que proceda la cancelación del servicio, si así no lo hiciere, deberá pagar a partir del mes siguiente la nueva tarifa. PARAGRAFO: Las tarifas tendrán un aumento ordinario automático con efectos a partir del primero (1) de enero de cada año, así las partes no suscriban el texto de renovación o prórroga del contrato en forma inmediata o así lo suscriban con posterioridad.</p>
  
  <h3>OCTAVA. FORMA Y PERIODO DE PAGO</h3> 
  <p>El pago de la tarifa por EL USUARIO será por mes anticipado, dentro de los diez (10) primeros días del respectivo mes, y se pagara mediante consignación directa en la cuenta 24221273229 de Bancolombia y que se encuentra a nombre de "PREVIMED TU MEDICO EN CASA" S.A.S., o mediante autorización de descuento automático de tarjeta de crédito o débito o de cuenta corriente, por medio electrónicos, pago directo en las oficinas de "PREVIMED TU MEDICO EN CASA" S.A.S. o mediante el pago a domicilio. Estos dos últimos esquemas no serán de obligatoria utilización por parte de "PREVIMED TU MEDICO EN CASA" S.A.S.Así mismo,"PREVIMED TU MEDICO EN CASA" S.A.S. podrá establecer, si así lo considera pertinente, convenios de recaudo de la tarifa con entidades a las cuales se encuentre vinculado EL USUARIO, tales como empleadores, asociaciones o cooperativas.</p>
  
  <h3>NOVENA: INTERESES DE MORA Y REQUERIMIENTO PREVIO A LA SUSPENSIÓN DEL SERVICIO Y TERMINACION DEL CONTRATO POR MORA EN EL PAGO DE LA TARIFA</h3>
  <p>El solo hecho de que EL USUARIO que suscribe este contrato no pague la tarifa dentro del término señalado generará Intereses de mora causados a la tasa más alta permitida por la ley desde el día que debía pagar y no pago y hasta la fecha del pago efectivo, sin que para la generación de los intereses sea necesario requerimiento alguno o constitución en mora por parte de "PREVIMED TU MEDICO EN CASA" S.A.S. No obstante lo anterior, en caso de que EL CONTRATATANTE Incurra en mora en el pago de tres cuotas correspondientes a la tarifa, "PREVIMED TU MEDICO EN CASA" S.A.S. deberá enviarie una comunicación escrita Indicándole que si no paga las cuotas atrasadas, con los intereses de mora, dentro del término de cinco (5) días hábiles siguientes a la fecha de recibo de la comunicación se le suspenderá el servicio y posteriormente se le terminara el contrato.</p>
  
  <h3>DÉCIMA: OBLIGACIONES DE "PREVIMED TU MEDICO EN CASA" S.A.S. FRENTE A LA PRESENTACION DEL SERVICIO. RESPONSABILIDAD CIVIL Y ADMINISTRATIVA DE "PREVIMED TU MEDICO EN CASA" S.A.S</h3>
  <p>Las partes del contrato convienen expresamente que "PREVIMED TU MEDICO EN CASA" S.A.S. adquiere para con los USUARIOS de este contrato, obligaciones de medio y no de resultado por la presentación del servicio. Por ende todas las obligaciones de "PREVIMED TU MEDICO EN CASA" S.A.S., como son prestarle un servicio de atención médica en el domicilio del paciente y cualquiera otra, que surjan por causa o con ocasión del contrato son obligaciones de medio. También es claro para las partes que "PREVIMED TU MEDICO EN CASA" S.A.S. tampoco adqulere una obligación de resultado frente a EL USUARIO y/o los USUARIOS del servicio por accidentes que puedan ocurrir exógenamente a la actividad médica realizada o practicada al paciente, ni en forma alguna se rige la responsabilidad de "PREVIMED TU MEDICO EN CASA" S.A.S. por el régimen de las actividades peligrosas o régimen de presunción de culpa en general o de responsabilidad objetiva. En consecuencia, la responsabilidad de "PREVIMED TU MEDICO EN CASA" S.A.S. solo surgirá cuando se establezca una culpa grave o dolo en el Incumplimiento de sus obligaciones. DÉCIMA PRIMERA: CAUSALES DE EXONERACION: "PREVIMED TU MEDICO EN CASA" S.A.S. no asume ninguna responsabilidad por daños o perjuicios que puedan sobrevenir a EL USUARIO o a los USUARIOS en el desarrollo de los servicios, si ellos provienen de caso fortuito o de fuerza mayor, como tampoco si ha actuado con diligencia y cuidado en la presentación del servicio. </p>
  
  <h3>DÉCIMA PRIMERA:CAUSALES DE EXONERACION</h3> 
  <p>"PREVIMED TU MEDICO EN CASA" S.A.S. no asume ninguna responsabilidad por daños o perjuicios que puedan sobrevenir a EL USUARIO o a los USUARIOS en el desarrollo de los servicios, si ellos provienen de caso fortuito o de fuerza mayor, como tampoco si ha actuado con diligencia y cuidado en la presentación del servicio.</p>
  
  <h3>DÉCIMA SEGUNDA: VERACIDAD DE LA INFORMACION</h3>
  <p>EL USUARIO declara que todos los datos personales y antecedentes clínicos que él y los USUARIOS han suministrado a "PREVIMED TU MEDICO EN CASA" S.A.S. en sus fichas de contratación, recogidos en este contrato, son totalmente verídicos. Si se comprobare que alguno no lo es será causal para dar por terminado por justa causa este contrato por parte de "PREVIMED". </p>
  
  <h3>DÉCIMA TERCERA: NOTIFICACIONES POR PARTE "PREVIMED"</h3>
  <p>Se entiende por válida cualquier notificación que, bien por telegrama, carta, correo electrónico, o cualquier otro medio idóneo, haga "PREVIMED TU MEDICO EN CASA" S.A.S., a EL USUARIO en la dirección indicada en el presente contrato o en cualquiera otra dirección física o electrónica Informada por EL USUARIO. Cualquier camblo de dirección debe ser notificado previamente a la otra parte.</p>
  
  <h3>DÉCIMA CUARTA: AREA DE COBERTURA</h3>
  <p>El servicio de medicina general domiciliaria brindado por PREVIMED se prestara únicamente dentro del municipio de Popayán en la dirección de la residencia que señale el usuario al momento de la suscripción de este contrato y se encuentra sujeto a restricciones en los eventos que el paciente se halle en lugar diferente a la dirección suministrada.</p>
  
  <h3>DÉCIMA QUINTA: TERMINACION DEL CONTRATO</h3>
  <p>Este contrato termina por las siguientes causales: 1. Por incumplimiento de EL USUARIO que suscribe este contrato en el pago de la cuota, previo el agotamiento del procedimiento indicado relativo al requerimlento previo a la suspensión del servicio y terminación del contrato por mora en el pago de la tarifa. 2. Por permitir EL USUARIO la utilización del servicio por un tercero sin derecho al mismo, en casos tales como, suplantación, entre otros. 3. Por dar EL O LOS USUARIOS de este contrato información falsa o engañosa a "PREVIMED" o a su personal, bien del área Administrativa o bien del área Médica. 4. Por decisión voluntaria de EL USUARIO firmante de este contrato, manifestada por escrito conforme lo establece la cláusula tercera de este contrato. En este caso EL USUARIO deberá manifestar el motivo de inconformidad, los datos que permitan su Identificación, y la comunicación deberá ser presentada personalmente por aquel o con diligencia de presentación personal ante notario. 5. Por terminación de la persona jurídica de PREVIMED o su licencia de funcionamiento. PARAGRAFO PRIMERO: En caso de terminación del contrato por parte de PREVIMED, se devolverá la tarifa no devengada cuando ésta haya sido pagada anticipadamente. Los valores a devolver se contarán por meses y en ningún caso se hará devolución por días. En todo caso, cuando la revocación o terminación del contrato tenga como causa una razón imputable al CONTRATANTE USUARIO y no hubiere cumplido un año de afiliación, "PREVIMED TU MEDICO EN CASA" S.A.S. le cobrara a título de sanción el cincuenta por ciento (50%) de las cuotas que correspondan a los periodos que falten para ajustar el primer año (1) de afiliación.</p>
  
  <h3>DÉCIMA SEXTA: AUTORIZACION PARA EL TRATAMIENTO DE DATOS PERSONALES POR PARTE DE "PREVIMED TU MEDICO EN CASA" S.A.S</h3> 
  <p>El Afiliado y/o Beneficiario del presente contrato autoriza a "PREVIMED TU MEDICO EN CASA" S.A.S. para que los datos personales contenidos en el presente contrato, sean recolectados en su base de datos y utilizados por la compañía, sus empleados, representantes, agentes y contratistas, en desarrollo del objeto social con la finalidad principal de (a) Realizar campañas de publicidad y mercadeo para ofrecer descuentos propios o de terceros promociones de productos o servicios; (b) informar sobre cambios de los productos o servicios: (c) Implementar programas de fidelización; (d) Evaluar la calidad de nuestros productos y servicios; (e) Realizar estudios de crédito, cobranza o riesgo crediticio; (f) Ejecutar las obligaciones derivadas de los contratos de afiliación, contratos comerciales y laborales en los cuales "PREVIMED" es parte; (g) Llevar a cabo los trámites de atención de PQR s presentadas ante la Compañía: (h) Celebrar convenios con terceros: (1) Cualquier otra finalidad que llegare a resultar en desarrollo del contrato o la relación comercial entre "PREVIMED" y el Titular y en general para que haga uso de los mismos de acuerdo con los establecidos en la Politica de Tratamiento de Datos de dicha compañía, la cual declara conocer, se encuentra publicada en la página web www.previmed.com.co y hace parte integrante del presente contrato.</string>
  
  <h3>DÉCIMA SEPTIMA: MODIFICACIÓN AL CONTRATO.</h3>
  <p>Cualquier modificación del contrato mientras esté vigente, solo podrá hacerse de común acuerdo, por escrito entre las partes. Lo anterior sin perjuicio de lo establecido para el cambio de tarifa o precio.</p>
  
  <h3>DÉCIMA OCTAVA: NEGACION DEL SERVICIO.</h3>
  <p>En caso de negación de servicios a un USUARIO de "PREVIMED", procederá de la siguiente manera: se explicará al USUARIO en forma completa y respetuosa las razones por las cuales no tiene derecho a acceder al servicio en salud sollicitado y se le indicaran las alternativas de que dispone a través del sistema general de seguridad social en salud para acceder al servicio o medicamento.</p>

  <div class="signature">
    <div class="sign-line">Por PREVIMED S.A.S</div>
    <div class="sign-line">Titular: ${data.titularNombre}</div>
  </div>

  <footer>
    <p class="muted">Dirección: ${data.direccionPrevimed} · Cel: ${data.telefonoPrevimed}</p>
    <p style="margin:0; color:#999; font-size:12px;">© ${new Date().getFullYear()} PREVIMED S.A.S. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
`