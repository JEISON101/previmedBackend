import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'

import SolicitudesService from '#services/SolicitudesServices'
import type { TipoSolicitud } from '../interfaces/solicitudes.js'

type Filtros = {
  estado?: boolean
  tipo_solicitud?: TipoSolicitud
  usuario_id?: string
  page?: number
  perPage?: number
}

@inject()
export default class SolicitudesController {
  constructor(private service: SolicitudesService) {}

  // Validadores (sin TIPOS_SOLICITUD)
  private queryValidator = vine.compile(
    vine.object({
      estado: vine.boolean().optional(),
      tipo_solicitud: vine.string().optional(), // validación como string
      usuario_id: vine.string().optional(),
      page: vine.number().positive().withoutDecimals().optional(),
      perPage: vine.number().positive().max(100).withoutDecimals().optional(),
    })
  )

  private createValidator = vine.compile(
    vine.object({
      nombre: vine.string().trim().minLength(1),
      apellido: vine.string().trim().minLength(1),
      email: vine.string().email(),
      autorizacion_datos: vine.accepted(),
      usuario_id: vine.string().optional(), 
      telefono: vine.string().optional().transform((v) => v ?? ''),
      descripcion: vine.string().optional().transform((v) => v ?? ''),
      segundo_nombre: vine.string().optional().transform((v) => v ?? ''),
      segundo_apellido: vine.string().optional().transform((v) => v ?? ''),
      tipo_solicitud: vine.string(),        
      estado: vine.boolean().optional(),
    })
  )

  private updateValidator = vine.compile(
    vine.object({
      nombre: vine.string().optional(),
      apellido: vine.string().optional(),
      email: vine.string().email().optional(),
      autorizacion_datos: vine.boolean().optional(),
      usuario_id: vine.string().optional(),
      telefono: vine.string().optional().transform((v) => v ?? ''),
      descripcion: vine.string().optional().transform((v) => v ?? ''),
      segundo_nombre: vine.string().optional().transform((v) => v ?? ''),
      segundo_apellido: vine.string().optional().transform((v) => v ?? ''),
      tipo_solicitud: vine.string().optional(), 
      estado: vine.boolean().optional(),
    })
  )

  // listar solicitudes
  async readAll({ request, response }: HttpContext) {
    try {
      const raw = await request.validateUsing(this.queryValidator)
      const filtros: Filtros = {
        estado: raw.estado,
        tipo_solicitud: raw.tipo_solicitud as TipoSolicitud | undefined,
        usuario_id: raw.usuario_id,
        page: raw.page,
        perPage: raw.perPage,
      }
      const data = await this.service.listar(filtros)
      return response.ok({ data })
    } catch (error: any) {
      return response.badRequest({ message: 'Error al listar', error: error.messages ?? error.message })
    }
  }

  // listar solicitudes con id
  async readId({ params, response }: HttpContext) {
    const item = await this.service.obtener(params.id)
    if (!item) return response.notFound({ message: 'Solicitud no encontrada' })
    return response.ok({ data: item })
  }

  // crear solicitudes
  async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(this.createValidator)
      const created = await this.service.crear({
        ...payload,
        tipo_solicitud: payload.tipo_solicitud as TipoSolicitud,
      })
      return response.created({ message: 'Creada', data: created })
    } catch (error: any) {
      return response.badRequest({ message: 'Datos inválidos', error: error.messages ?? error.message })
    }
  }

  //actualixar
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(this.updateValidator)
      const updated = await this.service.actualizar(params.id, {
        ...data,
        tipo_solicitud: (data.tipo_solicitud as TipoSolicitud | undefined) ?? undefined,
      })
      if (!updated) return response.notFound({ message: 'Solicitud no encontrada' })
      return response.ok({ message: 'Actualizada', data: updated })
    } catch (error: any) {
      return response.badRequest({ message: 'Datos inválidos', error: error.messages ?? error.message })
    }
  }

  // eliminar
  async delete({ params, response }: HttpContext) {
    const ok = await this.service.eliminar(params.id)
    if (!ok) return response.notFound({ message: 'Solicitud no encontrada' })
    return response.ok({ message: 'Eliminada' })
  }

  // cambiar estado 
  async cambiarEstado({ params, request, response }: HttpContext) {
    const schema = vine.compile(vine.object({ estado: vine.boolean() }))
    const { estado } = await request.validateUsing(schema)
    const updated = await this.service.cambiarEstado(params.id, estado)
    if (!updated) return response.notFound({ message: 'Solicitud no encontrada' })
    return response.ok({ message: 'Estado actualizado', data: updated })
  }
}
