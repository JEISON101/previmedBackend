import PlanXBeneficiosServices from '#services/PlanXBeneficiosServices'
import type { HttpContext } from '@adonisjs/core/http'

const planxBeneficio = new PlanXBeneficiosServices()

export default class PlanXBeneficiosController {
  async createPlanBeneficio({ request, response }: HttpContext) {
    try {
      const { plan_id, beneficio_id } = request.body();
      const newPlanxBeneficio = await planxBeneficio.create({ plan_id, beneficio_id });
      return response.status(201).json({ msg: 'Registro creado', data: newPlanxBeneficio })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al crear el registro', error: e })
    }
  }
}
