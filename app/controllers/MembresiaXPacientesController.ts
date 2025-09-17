import type { HttpContext as Ctx } from '@adonisjs/core/http'
import MembresiaXPacienteService from '#services/MembresiaXPacientesServices'

export default class MembresiaXPacienteController {
  private service = new MembresiaXPacienteService()

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
    const registro = await this.service.findById(id)
    return response.ok(registro)
  }

  // Crear
  public async register({ request, response }: Ctx) {
    const { paciente_id, membresia_id } = request.only(['paciente_id', 'membresia_id'])

    if (typeof paciente_id !== 'number' || paciente_id <= 0) {
      return response.badRequest({ error: 'paciente_id (number) es requerido y debe ser positivo' })
    }
    if (typeof membresia_id !== 'number' || membresia_id <= 0) {
      return response.badRequest({ error: 'membresia_id (number) es requerido y debe ser positivo' })
    }

    const created = await this.service.create({ paciente_id, membresia_id })
    return response.created(created)
  }

  // Actualizar
  public async update({ params, request, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }

    const { paciente_id, membresia_id } = request.only(['paciente_id', 'membresia_id'])

    const payload: any = {}
    if (paciente_id !== undefined) {
      if (typeof paciente_id !== 'number' || paciente_id <= 0) {
        return response.badRequest({ error: 'paciente_id debe ser number positivo' })
      }
      payload.paciente_id = paciente_id
    }
    if (membresia_id !== undefined) {
      if (typeof membresia_id !== 'number' || membresia_id <= 0) {
        return response.badRequest({ error: 'membresia_id debe ser number positivo' })
      }
      payload.membresia_id = membresia_id
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
