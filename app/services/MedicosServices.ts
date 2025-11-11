import Medico from '#models/medico'
import db from '@adonisjs/lucid/services/db' // ✅ NUEVO: para consultar la tabla `visitas`
import type {
  CreateMedicoData,
  UpdateMedicoData,
  MedicoFilters,
  MedicoResponse,
  MedicoServiceInterface
} from '../interfaces/medicos.js'

export default class MedicoService implements MedicoServiceInterface {
  async obtenerTodos(filtros?: MedicoFilters): Promise<MedicoResponse[]> {
    const query = Medico.query().preload('usuario')

    if (filtros) {
      if (filtros.disponibilidad !== undefined) {
        query.where('disponibilidad', filtros.disponibilidad)
      }
      if (filtros.estado !== undefined) {
        query.where('estado', filtros.estado)
      }
      if (filtros.usuario_id) {
        query.where('usuario_id', filtros.usuario_id)
      }
    }

    const medicos = await query.exec()
    return medicos.map(medico => this.transformarAResponse(medico))
  }

  async obtenerPorId(id: number): Promise<MedicoResponse | null> {
    try {
      const medico = await Medico.query()
        .where('id_medico', id)
        .preload('usuario')
        .firstOrFail()
      
      return this.transformarAResponse(medico)
    } catch (error) {
      return null
    }
  }

  async crear(data: CreateMedicoData): Promise<MedicoResponse> {
    const medico = await Medico.create({
      disponibilidad: data.disponibilidad,
      estado: data.estado ?? true, // Por defecto activo
      usuario_id: data.usuario_id
    })

    await medico.load('usuario')
    return this.transformarAResponse(medico)
  }

  async actualizar(id: number, data: UpdateMedicoData): Promise<MedicoResponse | null> {
    try {
      const medico = await Medico.findOrFail(id)
      
      if (data.disponibilidad !== undefined) {
        medico.disponibilidad = data.disponibilidad
      }
      if (data.estado !== undefined) {
        medico.estado = data.estado
      }

      await medico.save()
      await medico.load('usuario')
      
      return this.transformarAResponse(medico)
    } catch (error) {
      return null
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      const medico = await Medico.findOrFail(id)
      await medico.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async cambiarDisponibilidad(id: number, disponible: boolean): Promise<MedicoResponse | null> {
    try {
      const medico = await Medico.findOrFail(id)
      medico.disponibilidad = disponible
      await medico.save()
      await medico.load('usuario')
      
      return this.transformarAResponse(medico)
    } catch (error) {
      return null
    }
  }

  async obtenerDisponibles(): Promise<MedicoResponse[]> {
    const medicos = await Medico.query()
      .where('disponibilidad', true)
      .where('estado', true)
      .preload('usuario')

    return medicos.map(medico => this.transformarAResponse(medico))
  }

  async obtenerPorUsuarioId(usuarioId: string): Promise<MedicoResponse | null> {
    try {
      const medico = await Medico.query()
        .where('usuario_id', usuarioId)
        .preload('usuario')
        .first()

      return medico ? this.transformarAResponse(medico) : null
    } catch {
      return null
    }
  }

  // =========================
  // ✅ NUEVOS MÉTODOS
  // =========================

  /** Total de visitas para un médico específico (tabla `visitas`) */
  async totalVisitasPorMedico(medicoId: number): Promise<number> {
    const [row] = await db.from('visitas').where('medico_id', medicoId).count('* as total')
    return Number((row as any)?.total || 0)
  }

  /** Visitas agrupadas por médico → [{ medico_id, label, total }] */
  async visitasAgrupadasPorMedico(): Promise<Array<{ medico_id: number; label: string; total: number }>> {
    const rows = await db
      .from('visitas')
      .select('medico_id')
      .count('* as total')
      .groupBy('medico_id')

    if (rows.length === 0) return []

    const ids = rows.map((r: any) => r.medico_id)
    const medicos = await db
      .from('medicos')
      .join('usuarios', 'usuarios.id_usuario', 'medicos.usuario_id')
      .whereIn('medicos.id_medico', ids)
      .select('medicos.id_medico', 'usuarios.nombre', 'usuarios.apellido')

    const mapNombre = new Map<number, string>()
    medicos.forEach((m) => mapNombre.set(m.id_medico, `${m.nombre} ${m.apellido}`))

    return rows.map((r: any) => ({
      medico_id: r.medico_id,
      label: mapNombre.get(r.medico_id) || `Médico ${r.medico_id}`,
      total: Number(r.total),
    }))
  }

  private transformarAResponse(medico: Medico): MedicoResponse {
    return {
      id_medico: medico.id_medico,
      disponibilidad: medico.disponibilidad,
      estado: medico.estado,
      usuario_id: medico.usuario_id,
      usuario: medico.usuario ? {
        id_usuario: medico.usuario.id_usuario,
        nombre: medico.usuario.nombre,
        apellido: medico.usuario.apellido,
        email: medico.usuario.email,
        numero_documento: medico.usuario.numero_documento
      } : undefined
    }
  }
}
