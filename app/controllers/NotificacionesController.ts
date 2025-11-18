import NotificacionesServices from "#services/NotificacionesServices";
import { HttpContext } from "@adonisjs/core/http";

const newNotificacion = new NotificacionesServices()

export default class NotificacionesController{
    async create({request, response}:HttpContext){
        try{
            const {paciente_id, medico_id, registro_pago_id, cobrador_id} = request.body()

            const notificacion = await newNotificacion.create({paciente_id, medico_id, registro_pago_id, cobrador_id})

            return response.status(201).json({message:'Exito', data:notificacion})
        }catch(e){
            return response.status(500).json({message:'Error interno.', error:e.message})
        }
    }
    async notifiMedi({params, response}:HttpContext){
        try{
            const {idMedico} = params

            const notificaciones = await newNotificacion.notifiMedi(idMedico)

            return response.status(200).json({message:'Exito', data:notificaciones})
        }catch(e){
            return response.status(500).json({message:'Error interno.'})
        }
    }
    async notifiVista({params, response}:HttpContext){
        try{
            const {idNot} = params
            const upNot = await newNotificacion.update(idNot)
            return response.status(200).json({message:'Exito', data:upNot})
        }catch(e){
            return response.status(500).json({message:'Error interno.'})
        }
    }
}