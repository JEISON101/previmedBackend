import { HttpContext } from "@adonisjs/core/http";
import XLSX from 'xlsx'
import fs from 'fs'
import FormasPago from "#models/formas_pago";
import Ep from "#models/ep";
import Plane from "#models/plane";
import UsuarioService from "#services/UsuariosServices";
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import PacientesServices from "#services/PacientesServices";

export default class ExcelController {

  async importExcel({request, response}: HttpContext) {
    const userService = new UsuarioService();
    const service = new PacientesServices;
    const file = request.file("excel", {extnames: ['xlsx', 'xls']});

    if (!file) {
      return response.badRequest({
        success: false,
        message: 'No se ha proporcionado ningún archivo'
      });
    }

    if (!file.isValid) {
      return response.badRequest({
        success: false,
        message: 'El archivo no es válido',
        errors: file.errors
      });
    }

    // Variables para los contadores
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    let processed: any[] = [];

    // Función para convertir fechas de Excel
    function convertirFecha(serial: number) {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400; 
      return new Date(utc_value * 1000);
    }

    // Función para normalizar fechas
    function normalizarFecha(valor: any): string | Date {
      if (!valor) return "";
      if (typeof valor === 'number') {
        return convertirFecha(valor);
      }
      return valor.toString().trim();
    }

    // Función para obtener valores string seguros
    function obtenerString(valor: any, porDefecto: string = ""): string {
      return valor?.toString().trim() || porDefecto;
    }

    // Función para obtener valores numéricos seguros
    function obtenerNumero(valor: any, porDefecto: number = 0): number {
      const num = Number(valor);
      return isNaN(num) ? porDefecto : num;
    }

    try {
      // Leer el archivo
      const fileBuffer = fs.readFileSync(file.tmpPath!);
      const workBook = XLSX.read(fileBuffer, {type: "buffer"});
      const sheet = workBook.Sheets[workBook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(sheet, {range: 4, blankrows: false});

      if (data.length === 0) {
        return response.badRequest({
          success: false,
          message: 'El archivo no contiene datos válidos'
        });
      }

      // Pre-cargar formas de pago, EPS y Planes en paralelo
      const [formasPago, epsList, planes] = await Promise.all([
        FormasPago.all(),
        Ep.all(),
        Plane.all()
      ]);

      const formasPagoMap = new Map(formasPago.map(fp => [fp.tipo_pago.toLowerCase().trim(), fp.id_forma_pago]));
      const epsMap = new Map(epsList.map(e => [e.nombre_eps.toLowerCase().trim(), e.id_eps]));
      const planesMap = new Map(planes.map(p => [p.tipo_plan.toLowerCase().trim(), p.id_plan]));

      // Procesar cada fila
      for (const [index, fila] of data.entries()) {
        try {
          const documento = obtenerString(fila["Número de Documento"]);
          
          // Validar documento
          if (!documento || documento.length === 0) {
            skipped++;
            processed.push({
              ...fila,
              status: 'Omitido',
              motivo: 'Número de documento vacío'
            });
            continue;
          }

          // Verificar si ya existe
          const user = await userService.doc(documento);
          if (user != null) {
            skipped++;
            processed.push({
              ...fila,
              status: "Omitido",
              motivo: "Documento ya registrado"
            });
            continue;
          }

          // Obtener IDs de las relaciones
          const formaPagoNombre = obtenerString(fila["Forma de Pago"], "nequi").toLowerCase();
          const formaPagoId = formasPagoMap.get(formaPagoNombre);

          // Validar forma de pago
          if (!formaPagoId) {
            skipped++;
            processed.push({
              ...fila,
              status: 'Omitido',
              motivo: `Forma de pago "${formaPagoNombre}" no encontrada. Disponibles: ${Array.from(formasPagoMap.keys()).join(', ')}`
            });
            continue;
          }

          const epsId = epsMap.get(obtenerString(fila["EPS"]).toLowerCase());
          const planId = planesMap.get(obtenerString(fila["Plan"]).toLowerCase());

          // Construir el objeto de datos (igual que en el controlador original)
          const dataPaciente = {
            titular: {
              usuario: {
                id_usuario: uuidv4(),
                nombre: obtenerString(fila["Nombre"]),
                segundo_nombre: obtenerString(fila["Segundo Nombre"]),
                apellido: obtenerString(fila["Apellido"]),
                segundo_apellido: obtenerString(fila["Segundo Apellido"]),
                email: obtenerString(fila["Correo Electrónico"]),
                password: await bcrypt.hash(obtenerString(fila["Contraseña"], "123456"), 10),
                direccion: obtenerString(fila["Dirección"]),
                numero_documento: documento,
                fecha_nacimiento: normalizarFecha(fila["Fecha de Nacimiento"]),
                rol_id: 4,
                genero: obtenerString(fila["Género"]),
                tipo_documento: obtenerString(fila["Tipo de Documento"], "Cédula de ciudadanía"),
                estado_civil: obtenerString(fila["Estado Civil"]),
                numero_hijos: obtenerNumero(fila["Número de Hijos"]),
                estrato: obtenerNumero(fila["Estrato"]) || null,
                eps_id: epsId || null,
                autorizacion_datos: true
              },
              paciente: {
                activo: true,
                beneficiario: obtenerString(fila["Uso del Servicio"]).toLowerCase() === "si",
                direccion_cobro: obtenerString(fila["Dirección de Cobro"]) || obtenerString(fila["Dirección"]),
                ocupacion: obtenerString(fila["Ocupación"])
              }
            },
            contrato: {
              firma: `${obtenerString(fila["Nombre"])} ${obtenerString(fila["Apellido"])}`,
              forma_pago: obtenerString(fila["Forma de Pago del Contrato"], "nequi"),
              numero_contrato: obtenerString(fila["Numero de Contrato"] || fila["Numero del Contrato"]) || `CT-${Date.now()}-${index}`,
              fecha_inicio: normalizarFecha(fila["Contrato Inicio"]),
              fecha_fin: normalizarFecha(fila["Contrato Fin"]),
              plan_id: planId || null,
              estado: false
            },
            beneficiarios: [],
            pago: {
              monto: obtenerNumero(fila["Monto"]),
              fecha_inicio: normalizarFecha(fila["Fecha Inicio Pago"]),
              fecha_fin: normalizarFecha(fila["Fecha Fin Pago"]),
              fecha_pago: normalizarFecha(fila["Fecha Inicio Pago"]), // fecha_pago = fecha_inicio
              forma_pago_id: formaPagoId
            }
          };

          // Registrar directamente en el servicio (sin pasar por el controlador)
          await service.registroCompletoTitular(dataPaciente);
          
          inserted++;
          processed.push({
            ...fila,
            status: 'Insertado',
            motivo: 'Registro exitoso'
          });

        } catch (error) {
          errors++;
          processed.push({
            ...fila,
            status: 'Error',
            motivo: error.message || 'Error al procesar la fila'
          });
        }
      }

      // Limpiar archivo temporal
      try {
        if (file.tmpPath && fs.existsSync(file.tmpPath)) {
          fs.unlinkSync(file.tmpPath);
        }
      } catch (cleanupError) {
        throw cleanupError
      }

      return response.ok({
        ok: true,
        success: true,
        message: 'Importación completada',
        resultado: {
          total: data.length,
          insertados: inserted,
          actualizados: updated,
          omitidos: skipped,
          errores: errors
        },
        processed
      });

    } catch (error: any) {
      // Limpiar archivo en caso de error
      try {
        if (file.tmpPath && fs.existsSync(file.tmpPath)) {
          fs.unlinkSync(file.tmpPath);
        }
      } catch (cleanupError) {
        throw cleanupError
      }
      
      return response.internalServerError({
        ok: false,
        success: false,
        message: 'Error al procesar el archivo Excel',
        error: error.message
      });
    }
  }

async exportExcel({ params, response }: HttpContext) {
  const { filtro } = params
  const service = new PacientesServices()
  
  try {
    const buffer = await service.exportExcel(filtro)

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header('Content-Disposition', `attachment; filename="pacientes_${filtro}_${Date.now()}.csv"`)
    
    return response.send(buffer)
    
  } catch (error) {
    return response.status(500).send({
      message: "Error al exportar los pacientes", 
      error: error.message
    })
  }
}
}