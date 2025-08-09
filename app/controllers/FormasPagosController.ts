import FormasPagosServices from '#services/FormasPagosServices'
import type { HttpContext } from '@adonisjs/core/http'

const formasPagos = new FormasPagosServices()

export default class FormasPagosController {
  async createFormaPago({ request, response }: HttpContext) {
    try {
      const { tipo_pago, estado } = request.body()
      const formaPago = await formasPagos.create({ tipo_pago, estado })
      return response.status(201).json({ msg: 'registro creado', data: formaPago })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al crear el registro', error: e })
    }
  }
}
