import FormasPagosServices from '#services/FormasPagosServices'
import type { HttpContext as Ctx, HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { messages } from '@vinejs/vine/defaults'

export default class FormasPagosController {
  private service = new FormasPagosServices()

  // Listar todos
  public async read({ response }: Ctx) {
    const data = await this.service.list()
    return response.ok(data)
  }

  // Listar por ID
  public async readId({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    const formaPago = await this.service.findById(id)
    return response.ok(formaPago)
  }
  //crear
  public async register({ request, response }: Ctx) {
    const { id_forma_pago, tipo_pago, estado } = request.only([
      'id_forma_pago',
      'tipo_pago',
      'estado',
    ])

    // Validaciones mínimas
    if (typeof tipo_pago !== 'string' || !tipo_pago.trim()) {
      return response.badRequest({ error: 'tipo_pago (string) es requerido' })
    }
    if (typeof estado !== 'boolean') {
      return response.badRequest({ error: 'estado (boolean) es requerido' })
    }
    if (id_forma_pago !== undefined && (typeof id_forma_pago !== 'number' || id_forma_pago < 0)) {
      return response.badRequest({ error: 'id_forma_pago debe ser un número positivo' })
    }
    const created = await this.service.create({ id_forma_pago, tipo_pago, estado })
    return response.created(created)
  }
  //actualizar
  public async update({ params, request, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    const { tipo_pago, estado } = request.only(['tipo_pago', 'estado'])

    const payload: any = {}
    if (tipo_pago !== undefined) {
      if (typeof tipo_pago !== 'string' || !tipo_pago.trim()) {
        return response.badRequest({ error: 'tipo_pago debe ser string no vacío' })
      }
      payload.tipo_pago = tipo_pago
    }
    if (estado !== undefined) {
      if (typeof estado !== 'boolean') {
        return response.badRequest({ error: 'estado debe ser boolean' })
      }
      payload.estado = estado
    }
    const updated = await this.service.update(id, payload)
    return response.ok(updated)
  }
  //eliminar
  public async delete({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    const result = await this.service.delete(id)
    return response.ok(result)
  }
  //cambiar estado del pago a activo e incativo
  async cambiarEstado({ params, request, response }: HttpContext) {
    const esquema = vine.compile(vine.object({ estado: vine.boolean() }))
    const { estado } = await request.validateUsing(esquema)
    const update = await this.service.cambiarEstado(params.id, estado)
    if (!update) return response.notFound({ message: 'Estado no cambiado' })
    return response.ok({ message: 'Estado actualizado', data: update })
  }
}
