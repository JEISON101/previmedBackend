import RegistrosPagoService from '#services/RegistrosPagosServices'
import { HttpContext } from '@adonisjs/core/http'
import { PostRegistroPago } from '../interfaces/registros_pagos.js'

export default class RegistrosPagoController {
  private service = new RegistrosPagoService()

  async get_all_registros_pago ({ response }: HttpContext) {
    try {
      const registros_pago = await this.service.get_all_pagos()
      return response.status(200).ok({data:registros_pago})
    } catch (error) {
      return response.status(500).send({
        message: 'Error al obtener los registros de pago',
        error: error.message
      })
    }
  }

  async get_registro_pago_id ({ params, response }: HttpContext) {
    try {
      const registro_pago = await this.service.get_pago_id(params.id)
      return response.status(200).ok({data:registro_pago})
    } catch (error) {
      return response.status(500).send({
        message: 'Error al obtener el registro de pago',
        error: error.message
      })
    }
  }

  async create_registro_pago ({ request, response }: HttpContext) {
      const data = request.body() as PostRegistroPago;
    try {
      await this.service.create_pago(data);
      return response.status(201).ok({message:'Registro de pago creado exitosamente'})
    } catch (error) {
      return response.status(500).send({
        message: 'Error al crear el registro de pago',
        error: error.message
      })
    }
  }

  async update_registro_pago ({ params, request, response }: HttpContext) {
    const data = request.body();
    try {
      await this.service.update_pago(params.id, data as PostRegistroPago);
      return response.status(201).ok({message:'Registro de pago actualizado exitosamente'})
    } catch(error) {
      return response.status(500).send({
        message:'Error al actualizar el registro de pago',
        error:error.message
      });
    }
  }

  async delete_registro_pago ({ params, response }: HttpContext) {
    try {
      await this.service.delete_pago(params.id)
      return response.status(200).send({message: 'Registro de pago eliminado exitosamente'});
    } catch (error){
      return response.status(500).send({
        message:'Error al eliminar el registro de pago',
        error:error.message
      })
    }
  }
}
