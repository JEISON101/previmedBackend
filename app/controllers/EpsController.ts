import type { HttpContext as Ctx } from '@adonisjs/core/http'
import EpsServices from '#services/EpsServices'

export default class EpsController {
  private service = new EpsServices()

  //listar todos
  public async read({ response }: Ctx) {
    const data = await this.service.list()
    return response.ok(data)
  }

  //listar por id
  public async readId({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    const eps = await this.service.findById(id)
    return response.ok(eps)
  }

  // crear 
  public async register({ request, response }: Ctx) {
        const { id_eps, nombre_eps, estado } = request.only(['id_eps', 'nombre_eps', 'estado'])

    // Validaciones mínimas
    if (typeof nombre_eps !== 'string' || !nombre_eps.trim()) {
      return response.badRequest({ error: 'nombre_eps (string) es requerido' })
    }
    if (typeof estado !== 'boolean') {
      return response.badRequest({ error: 'estado (boolean) es requerido' })
    }
    if (id_eps !== undefined && (typeof id_eps !== 'number' || id_eps < 0)) {
      return response.badRequest({ error: 'id_eps debe ser un número positivo' })
    }

    const created = await this.service.create({ id_eps, nombre_eps, estado })
    return response.created(created)
  }

  //actualizar
  public async update({ params, request, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }

    const { nombre_eps, estado } = request.only(['nombre_eps', 'estado'])

    const payload: any = {}
    if (nombre_eps !== undefined) {
      if (typeof nombre_eps !== 'string' || !nombre_eps.trim()) {
        return response.badRequest({ error: 'nombre_eps debe ser string no vacío' })
      }
      payload.nombre_eps = nombre_eps
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

  // eliminar
  public async delete({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    await this.service.delete(id)
    return response.noContent()
  }
}
