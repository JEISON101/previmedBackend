import type { HttpContext as Ctx } from '@adonisjs/core/http'
import ContactosEmergenciaService from '#services/ContactosEmergenciasServices'

export default class ContactosEmergenciaController {
  private service = new ContactosEmergenciaService()

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
    const contacto = await this.service.findById(id)
    return response.ok(contacto)
  }

  // Crear
  public async register({ request, response }: Ctx) {
    const {
      nombre,
      apellido,
      parentesco,
      telefono,
      paciente_id,
    } = request.only(['nombre', 'apellido', 'parentesco', 'telefono', 'paciente_id'])

    if (typeof nombre !== 'string' || !nombre.trim()) {
      return response.badRequest({ error: 'nombre es requerido y debe ser string' })
    }
    if (typeof apellido !== 'string' || !apellido.trim()) {
      return response.badRequest({ error: 'apellido es requerido y debe ser string' })
    }
    if (typeof parentesco !== 'string' || !parentesco.trim()) {
      return response.badRequest({ error: 'parentesco es requerido y debe ser string' })
    }
    if (typeof telefono !== 'string' || !telefono.trim()) {
      return response.badRequest({ error: 'telefono es requerido y debe ser string' })
    }
    if (typeof paciente_id !== 'number' || paciente_id <= 0) {
      return response.badRequest({ error: 'paciente_id es requerido y debe ser número positivo' })
    }

    const created = await this.service.create({
      nombre,
      apellido,
      parentesco,
      telefono,
      paciente_id,
    })

    return response.created(created)
  }

  // Actualizar
  public async update({ params, request, response }: Ctx) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ error: 'Parámetro id inválido' })
    }

    const data = request.only(['nombre', 'apellido', 'parentesco', 'telefono', 'paciente_id'])

    const updated = await this.service.update(id, data)
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
