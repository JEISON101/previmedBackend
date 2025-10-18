// app/services/SolicitudesServices.ts
import Solicitude from '#models/solicitude'
import type { TipoSolicitud } from '../interfaces/solicitudes.js'

type CrearS = {
  nombre: string
  apellido: string
  email: string
  autorizacion_datos: boolean
  usuario_id: string
  telefono?: string
  descripcion?: string
  segundo_nombre?: string
  segundo_apellido?: string
  tipo_solicitud: TipoSolicitud
  estado?: boolean
}

type Filtros = {
  estado?: boolean
  tipo_solicitud?: TipoSolicitud
  usuario_id?: string
  page?: number
  perPage?: number
}

type ActualizarDTO = Partial<CrearS>

export default class SolicitudesService {
  // Crear
  async crear(payload: CrearS) {
    const s = await Solicitude.create({
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
      autorizacion_datos: !!payload.autorizacion_datos,
      usuario_id: payload.usuario_id,
      telefono: payload.telefono ?? '',
      descripcion: payload.descripcion ?? '',
      segundo_nombre: payload.segundo_nombre ?? '',
      segundo_apellido: payload.segundo_apellido ?? '',
      tipo_solicitud: payload.tipo_solicitud,
      estado: payload.estado ?? true,
    })
    return s
  }

  // Listar (con filtros y paginación opcional)
  async listar(f: Filtros = {}) {
    const q = Solicitude.query().orderBy('id_solicitud', 'desc')

    if (typeof f.estado === 'boolean') q.where('estado', f.estado)
    if (f.tipo_solicitud) q.where('tipo_solicitud', f.tipo_solicitud)
    if (f.usuario_id) q.where('usuario_id', f.usuario_id)

    if (f.page && f.perPage) {
      return q.paginate(f.page, f.perPage) // retorna LengthAwarePaginator
    }

    return await q // ejecuta y devuelve Solicitude[]
  }

  async obtener(id: string | number) {
    return Solicitude.find(id)
  }

  async actualizar(id: string | number, data: ActualizarDTO) {
    const s = await Solicitude.find(id)
    if (!s) return null

    // Opción 1: merge directo
    s.merge({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      autorizacion_datos: typeof data.autorizacion_datos === 'undefined' ? s.autorizacion_datos : !!data.autorizacion_datos,
      usuario_id: data.usuario_id,
      telefono: data.telefono ?? s.telefono ?? '',
      descripcion: data.descripcion ?? s.descripcion ?? '',
      segundo_nombre: data.segundo_nombre ?? s.segundo_nombre ?? '',
      segundo_apellido: data.segundo_apellido ?? s.segundo_apellido ?? '',
      tipo_solicitud: data.tipo_solicitud ?? s.tipo_solicitud,
      estado: typeof data.estado === 'undefined' ? s.estado : !!data.estado,
    })

    await s.save()
    return s
  }

  // Eliminar
  async eliminar(id: string | number) {
    const s = await Solicitude.find(id)
    if (!s) return false
    await s.delete()
    return true
  }

  // Cambiar estado
  async cambiarEstado(id: string | number, estado: boolean) {
    const s = await Solicitude.find(id)
    if (!s) return null
    s.estado = !!estado
    await s.save()
    return s
  }
}
