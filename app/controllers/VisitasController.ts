import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import VisitasServices from '#services/VisitasServices'

const visitasService = new VisitasServices()

export default class VisitasController {
  async crearVisita({ request, response }: HttpContext) {
    try {
      const {
        fecha_visita,
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      } = request.body()

      const nueva = await visitasService.crear({
        fecha_visita: DateTime.fromISO(fecha_visita), 
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      })

      return response.json({ msj: 'Visita creada', data: nueva })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisita({ response }: HttpContext) {
    try {
      const lista = await visitasService.listar()
      return response.json({ msj: lista })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisitaId({ params, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)
      const visita = await visitasService.listarId(id_visita)
      return response.json({ msj: visita })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async actualizarVisita({ params, request, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)

      const {
        fecha_visita,
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      } = request.body()

      const actualizado = await visitasService.actualizarVisita(id_visita, {
        fecha_visita: fecha_visita ? DateTime.fromISO(fecha_visita) : undefined, // 👈 solo convierte si viene
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      })

      return response.json({ msj: actualizado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async eliminarVisita({ params, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)
      const eliminado = await visitasService.eliminar(id_visita)
      return response.json({ msj: eliminado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async contarVisitas({ response }: HttpContext) {
    try {
      const cantidad = await visitasService.conteo()
      return response.json({ msj: cantidad })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisitasPaciente({ params, response }: HttpContext) {
    try {
      const paciente_id = Number(params.paciente_id)
      const visitas = await visitasService.listarPorPaciente(paciente_id)
      return response.json({ msj: visitas })
    } catch (error) {
      return response.json({ error: error.message })
    } 
  }


  async listarVisitasMedico({ params, response }: HttpContext) {
  try {
    const medico_id = Number(params.medico_id)
    const visitas = await visitasService.listarPorMedico(medico_id)
    return response.json({ msj: visitas })
  } catch (error) {
    return response.json({ error: error.message })
  }
}

}
