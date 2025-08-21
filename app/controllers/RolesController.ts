import type  { HttpContext } from '@adonisjs/core/http'
import RolesServices from '../services/RolesServices.js'

const rolesService = new RolesServices()

export default class RolesController{
async crearRol({request, response}: HttpContext){
    try{
        const {nombre_rol, estado} = request.body()
        const nuevo = await rolesService.crear({nombre_rol, estado})
        return response.json({msj:'Rol creado', data:nuevo})
    }catch(error){
        return response.json({ error: error.message })
        }
}

    async listarRol({response}: HttpContext){
        try{
            const lista = await rolesService.listar()
             return response.json({ msj: lista })
        }catch(error){
            return response.json({ error: error.message })
        }
    }

    async listarRolId({ params, response }: HttpContext){
        try{
           const id_rol = Number(params.id_rol)
           const rol = await rolesService.listarId(id_rol)
           return response.json({ msj: rol })    
        }catch(error){
      return response.json({ error: error.message })           
        }
    }

     async actualizarRol({ params, request, response }: HttpContext){
        try{
            const id_rol = Number(params.id_rol) 
            const {nombre_rol, estado} = request.body()
            const actualizado = await rolesService.actualizarRol(id_rol,{
                nombre_rol, estado
            })
             return response.json({ msj: actualizado })
        }catch (error) {
      return response.json({ error: error.message })
    }
     }

     async eliminarRol({ params, response }: HttpContext) {
        try{
            const id_rol =Number(params.id_rol)
            const eliminado = await rolesService.eliminar(id_rol)
            return response.json({ msj: eliminado })
        }catch (error) {
      return response.json({ error: error.message })
    }
     }

     async contarRol({ response }: HttpContext) {
    try {
      const cantidad = await rolesService.conteo()
      return response.json({ msj: cantidad })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

}