import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import TelefonoService from '#services/TelefonosServices'

const createTelefonoSchema = vine.compile(
  vine.object({
    telefono: vine.string().trim().minLength(5),
    usuario_id: vine.string().trim(),
  })
)

const updateTelefonoSchema = vine.compile(
  vine.object({
    telefono: vine.string().trim().minLength(5).optional(),
    usuario_id: vine.string().trim().optional(),
  })
)

export default class TelefonosController {
  private service = new TelefonoService()

  // listar todos GET /telefonos/read
  async readAll({ response }: HttpContext) {
    const data = await this.service.findAll()
    return response.ok(data)
  }

  // listar por el id del teledfono GET /telefonos/read/:id
  async readByIdTel({ params, response }: HttpContext) {
    const tel = await this.service.findById(Number(params.id))
    return response.ok(tel)
  }

  // listar por el id del usuario GET /telefonos/usuario/:usuario_id
  async readByIdUser({ params, response }: HttpContext) {
    const data = await this.service.findByUsuario(String(params.usuario_id))
    return response.ok(data)
  }

  // registrar POST /telefonos/register
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTelefonoSchema)
    const created = await this.service.create(payload)
    return response.created(created)
  }

  //actualizar PUT /telefonos/update/:id
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateTelefonoSchema)
    const updated = await this.service.update({
      id_telefono: Number(params.id),
      ...payload,
    })
    return response.ok(updated)
  }

  // eliminar DELETE /telefonos/delete/:id
  async delete({ params, response }: HttpContext) {
    await this.service.remove(Number(params.id))
    return response.noContent()
  }
}
