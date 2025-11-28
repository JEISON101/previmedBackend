import { HttpContext } from '@adonisjs/core/http'
import MembresiasService from '#services/MembresiasServices'
import * as pdf from "html-pdf-node"
import { plantillaContrato } from '../templates/plantillaContrato.js'
import PacientesServices from '#services/PacientesServices'

export default class MembresiasController {
  private service = new MembresiasService()

  async listar({ response }: HttpContext) {
    try {
      const datos = await this.service.listar()
      const serializados = datos.map((m) => m.toJSON()) // Incluye relaciones
      return response.ok(serializados)
    } catch (error) {
      return response.status(500).send({ error: error.message })
    }
  }

  async obtenerPorId({ params, response }: HttpContext) {
    try {
      const dato = await this.service.obtenerPorId(params.id)
      return response.ok(dato.toJSON()) //  También serializado
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }

  async crear({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'firma',
        'forma_pago',
        'numero_contrato',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'plan_id'
      ])
      const paciente_id = request.input('paciente_id')

      const nueva = await this.service.crear(
        {
          ...data,
          plan_id: Number(data.plan_id),
          estado: Boolean(data.estado)
        },
        paciente_id ? Number(paciente_id) : undefined
      )
      return response.created(nueva.toJSON())
    } catch (error) {
      return response.status(500).send({ error: error.message })
    }
  }

  async actualizar({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'firma',
        'forma_pago',
        'numero_contrato',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'plan_id'
      ])

      const actualizada = await this.service.actualizar(params.id, {
        ...data,
        plan_id: Number(data.plan_id),
        estado: Boolean(data.estado)
      })
      return response.ok(actualizada.toJSON())
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }

  async eliminar({ params, response }: HttpContext) {
    try {
      const msg = await this.service.eliminar(params.id)
      return response.ok({ mensaje: msg })
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }

  //buscar si el usuario tiene mebrecia activa por el documento
public async buscarActiva({ params, response }: HttpContext) {
    const { numeroDocumento } = params
    const servicio = new MembresiasService()

    try {
      const resultado = await servicio.buscarActivaPorDocumento(numeroDocumento)

      if (!resultado.ok) {
        return response.notFound(resultado)
      }

      return response.ok(resultado)
    } catch (error) {
      return response.status(500).send({
        ok: false,
        mensaje: 'Error no se encontro la membrecia.',
        error: error.message
      })
    }
  }

  async getPdfContrato({ params, response }: HttpContext) {
    const {idUsuario} = params;
    const service = new PacientesServices
    try {
      const pacientes = await service.getUsuariosId(idUsuario);
      if (Array.isArray(pacientes)) {
        const beneficiarios = pacientes.filter((p:any) => p.paciente_id && p.paciente_id != null);
        const titular = pacientes.find((p:any) => !p.pacienteId || p.pacienteId == null);
        const data = {
          direccionPrevimed: '',
          telefonoPrevimed: '',
          beneficiarios: beneficiarios,
          titularNombre: `${titular?.usuario.nombre??''} ${titular?.usuario.segundo_nombre??''} ${titular?.usuario.apellido??''} ${titular?.usuario.segundo_apellido??''}`,
          titularEmail: titular?.usuario.email??'',
          titularDocumento: titular?.usuario.numero_documento,
          membresia: '11241'
        }
        const pdf = await generarContratoPDF(data);
        response.header('Content-Type', 'application/pdf');
        response.header('Content-Disposition', 'attachment; filename="contrato.pdf"');
        return response.send(pdf);
      }
    } catch (error) {
      return response.status(500).send({
        message: 'Error al generar el contrato en pdf.',
      });
    }
  }

  async renovarContrato({ request, response }: HttpContext) {
    try {
      const service = new MembresiasService();
      const data = request.body();

      const resultado = await service.renovarContrato(data);

      return response.status(200).send({
        ok: true,
        message: "Contrato renovado exitosamente",
        data: resultado
      });
    } catch (error) {
      console.error('Error en renovarContrato controller:', error);
      return response.status(400).send({
        ok: false,
        message: "No se pudo renovar el contrato",
        error: error.message
      });
    }
  }

}

export async function generarContratoPDF(data: any): Promise<any> {
  const htmlFinal = plantillaContrato(data)

  const file = { content: htmlFinal }

  const pdfBuffer = await pdf.generatePdf(file, {
    format: "A4",
    margin: {
      top: "25mm",
      bottom: "25mm",
      left: "20mm",
      right: "20mm"
    },
    printBackground: true
  });

  return pdfBuffer;
}