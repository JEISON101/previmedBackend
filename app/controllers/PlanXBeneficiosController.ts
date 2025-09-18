import PlanXBeneficiosServices from '#services/PlanXBeneficiosServices'
import type { HttpContext } from '@adonisjs/core/http'

const planxBeneficio = new PlanXBeneficiosServices()

export default class PlanXBeneficiosController {
  async create({ request, response }: HttpContext) {
    try {
      const { plan_id, beneficio_id } = request.body();
      const newPlanxBeneficio = await planxBeneficio.create({ plan_id, beneficio_id });
      return response.status(201).json({ msg: 'Registro creado', data: newPlanxBeneficio })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al crear el registro', error: e })
    }
  }
  async getAllPlanBeneficios({ response }: HttpContext) {
    try {
      const allPlanxBeneficios = await planxBeneficio.list()
      return response.status(200).json({ msg: 'Lista de PlanXBeneficios', data: allPlanxBeneficios })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al obtener los registros', error: e })
    }
  }
  async getPlanBeneficioById({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (Number.isNaN(id)) {
        return response.status(400).json({ msg: 'Parámetro id inválido' })
      }
      const planxBeneficioById = await planxBeneficio.findById(id)
      return response.status(200).json({ msg: 'PlanXBeneficio encontrado', data: planxBeneficioById })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al obtener el registro', error: e })
    }
  } 
  async updatePlanBeneficio({ params, request, response }: HttpContext) {
    try {   
      const id = Number(params.id)
      if (Number.isNaN(id)) {
        return response.status(400).json({ msg: 'Parámetro id inválido' })
      }
      const { plan_id, beneficio_id } = request.body()
      const payload: any = {}
      if (plan_id !== undefined) {
        if (typeof plan_id !== 'number' || plan_id <= 0) {
          return response.status(400).json({ msg: 'plan_id debe ser number positivo' })
        }
        payload.plan_id = plan_id
      }
      if (beneficio_id !== undefined) {
        if (typeof beneficio_id !== 'number' || beneficio_id <= 0) {
          return response.status(400).json({ msg: 'beneficio_id debe ser number positivo' })
        }
        payload.beneficio_id = beneficio_id
      }
      const updatedPlanxBeneficio = await planxBeneficio.update(id, payload)
      return response.status(200).json({ msg: 'Registro actualizado', data: updatedPlanxBeneficio })
    }
    catch (e) {
      return response.status(500).json({ msg: 'Error al actualizar el registro', error: e })
    }
  }
  async deletePlanBeneficio({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)  
      if (Number.isNaN(id)) {
        return response.status(400).json({ msg: 'Parámetro id inválido' })
      }
      await planxBeneficio.delete(id)
      return response.status(204).json({ msg: 'Registro eliminado' })
    } catch (e) {
      return response.status(500).json({ msg: 'Error al eliminar el registro', error: e })
    } 
  }
}
