import RegistrosPagoService from '#services/RegistrosPagosServices'
import { HttpContext } from '@adonisjs/core/http'
import { PostRegistroPago } from '../interfaces/registros_pagos.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

  async subirImagen(file:any) {
    const upload = await cloudinary.uploader.upload(file.tmpPath!, {
      width: 1000,
      height: 800,
      crop: 'fill'
    });
    return upload.secure_url;
  }

  async create_registro_pago({ request, response }: HttpContext) {
    try {
      const foto = request.file('foto')
      const urlFoto = foto ? await this.subirImagen(foto) : undefined;
      const data = {...request.only([
        'monto',
        'fecha_inicio',
        'fecha_pago',
        'fecha_fin',
        'membresia_id',
        'forma_pago_id',
      ]),
      foto: urlFoto
    }
      const res = await this.service.create_pago(data);
      const pago = await this.service.get_pago_id(res.id_registro);
      return response.status(201).ok({ message: 'Registro de pago creado exitosamente', data:pago })
    } catch (error) {
      return response.status(500).send({ message: 'Error al crear el registro de pago', error: error.message })
    }
  }

  async update_registro_pago({ params, request, response }: HttpContext) {
    try {
      const foto = request.file('foto')
      const urlFoto = foto ? await this.subirImagen(foto) : undefined;
      const data = {
        ...request.only([
          'monto',
          'fecha_inicio',
          'fecha_pago',
          'fecha_fin',
          'membresia_id',
          'forma_pago_id',
        ]),
        ...(urlFoto && { foto: urlFoto }) // solo agrega foto si existe
      }
      const res = await this.service.update_pago(params.id, data as PostRegistroPago);
      const pago = await this.service.get_pago_id(res.id_registro);
      return response.status(200).ok({ message: 'Registro de pago actualizado exitosamente', data:pago })
    } catch (error) {
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

  async get_pagos_by_membresia({params, response}: HttpContext){
    const {id} = params
    try {
      const pagos = await this.service.get_pagos_by_membresia(id);
      return response.status(200).send({
        data: pagos,
        message: 'Pagos obtenidos exitosamente'
      })
    } catch (error) {
     return response.status(500).json({
      error: error.message,
      message: 'Ha ocurrido un error al obtener los pagos'
     }) 
    }
  }
}
