import type { HttpContext as Ctx } from '@adonisjs/core/http'
import BeneficiosServices from '#services/BeneficiosServices'

export default class BeneficiosController {
  private service = new BeneficiosServices()

  // Listar todos
  public async read({ response }: Ctx) {
    const data = await this.service.list()
    return response.ok(data)
  }

  // Listar por id
  public async readId({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    const beneficio = await this.service.findById(id)
    return response.ok(beneficio)
  }

  // Crear
  public async register({ request, response }: Ctx) {
    const { id_beneficio, tipo_beneficio } = request.only(['id_beneficio', 'tipo_beneficio'])

    if (typeof tipo_beneficio !== 'string' || !tipo_beneficio.trim()) {
      return response.badRequest({ error: 'tipo_beneficio (string) es requerido' })
    }
    if (id_beneficio !== undefined && (typeof id_beneficio !== 'number' || id_beneficio < 0)) {
      return response.badRequest({ error: 'id_beneficio debe ser un número positivo' })
    }

    const created = await this.service.create({ id_beneficio, tipo_beneficio })
    return response.created(created)
  }

  // Actualizar
  public async update({ params, request, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }

    const { tipo_beneficio } = request.only(['tipo_beneficio'])

    const payload: any = {}
    if (tipo_beneficio !== undefined) {
      if (typeof tipo_beneficio !== 'string' || !tipo_beneficio.trim()) {
        return response.badRequest({ error: 'tipo_beneficio debe ser string no vacío' })
      }
      payload.tipo_beneficio = tipo_beneficio
    }

    const updated = await this.service.update(id, payload)
    return response.ok(updated)
  }

  // Eliminar
  public async delete({ params, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }
    await this.service.delete(id)
    return response.noContent()
  }
}
