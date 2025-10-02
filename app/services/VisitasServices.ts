import Visita from "#models/visita"
import { DateTime } from "luxon"

class VisitasServices {
  async crear(data: {
    fecha_visita: DateTime,
    descripcion: string,
    direccion: string,
    estado: boolean,
    telefono: string,
    paciente_id: number,
    medico_id: number,
    barrio_id: number
  }) {
    return await Visita.create(data)
  }

  async listar() {
    return await Visita.query()
      .preload('paciente')
      .preload('medico')
      .preload('barrio')
  }

  async listarId(id: number) {
    return await Visita.query()
      .where('id_visita', id)
      .preload('paciente')
      .preload('medico')
      .preload('barrio')
      .first()
  }

  async actualizarVisita(id: number, data: {
    fecha_visita?: DateTime,
    descripcion?: string,
    direccion?: string,
    estado?: boolean,
    telefono?: string,
    paciente_id?: number,
    medico_id?: number,
    barrio_id?: number
  }) {
    const visita = await Visita.query().where('id_visita', id).firstOrFail()
    return await visita.merge(data).save()
  }

  async eliminar(id: number) {
    const encontrado = await Visita.find(id)
    if (encontrado) {
      await encontrado.delete()
      return 'Visita eliminada correctamente'
    } else {
      return 'No se eliminó'
    }
  }

  async conteo() {
    const resultado = await Visita.query().count('* as total')
    return resultado[0].$extras.total
  }
  async listarPorPaciente(pacienteId: number) {
    return await Visita.query()
      .where('paciente_id', pacienteId)
      .preload('paciente')
      .preload('medico')
      .preload('barrio')
  }
}

export default VisitasServices
