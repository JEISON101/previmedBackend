
import AuditoriasServices from '#services/AuditoriasServices';
import type { HttpContext } from '@adonisjs/core/http';
const auditorias = new AuditoriasServices()

export default class AuditoriasController {
  async createAuditoria({ request, response }: HttpContext) {
    try {
      const { tabla, accion, usuario_id, registro_id } = request.body();
      const newAduditoria = await auditorias.create({ tabla, accion, usuario_id, registro_id });
      return response.status(201).json({ msg: 'Registro creado', data: newAduditoria })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al crear el registro', error:e })
    }
  }
}
