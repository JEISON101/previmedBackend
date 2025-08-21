import type  { HttpContext } from '@adonisjs/core/http'
import PlanesServices from '../services/PlanesServices.js';

const planesService = new PlanesServices()

export default class PlanesController{
    async crearPlan({request, response}: HttpContext){
        try{
            const {tipo_plan, descripcion, precio, estado, cantidad_beneficiarios} = request.body()
            const nuevo = await planesService.crear({tipo_plan, descripcion, precio, estado, cantidad_beneficiarios})
            return response.json({msj:'Plan creado', data:nuevo})
        }catch(error){
        return response.json({ error: error.message })
        }
    }

    async listarPlanes({response}: HttpContext){
        try{
            const lista = await planesService.listar()
             return response.json({ msj: lista })
        }catch(error){
            return response.json({ error: error.message })
        }
    }

    async listarPlanId({ params, response }: HttpContext){
        try{
           const id_plan = Number(params.id_plan)
           const plan = await planesService.listarId(id_plan)
           return response.json({ msj: plan })    
        }catch(error){
      return response.json({ error: error.message })           
        }
    }

     async actualizarPlan({ params, request, response }: HttpContext) {
    try {
      const id_plan = Number(params.id_plan)
      const { tipo_plan, descripcion, precio, estado, cantidad_beneficiarios } = request.body()
      const actualizado = await planesService.actualizar(id_plan, {
        tipo_plan,
        descripcion,
        precio,
        estado,
        cantidad_beneficiarios
      })
      return response.json({ msj: actualizado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

   async eliminarPlan({ params, response }: HttpContext) {
    try {
      const id_plan = Number(params.id_plan)
      const eliminado = await planesService.eliminar(id_plan)
      return response.json({ msj: eliminado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async contarPlanes({ response }: HttpContext) {
    try {
      const cantidad = await planesService.conteo()
      return response.json({ msj: cantidad })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

}