import RegistrosPagoService from '#services/RegistrosPagosServices'
import { HttpContext } from '@adonisjs/core/http'
import { PostRegistroPago } from '../interfaces/registros_pagos.js'
import { v2 as cloudinary } from 'cloudinary'
import Membresia from '#models/membresia'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default class RegistrosPagoController {
  private service = new RegistrosPagoService()

  // ===== CRUD =====
  async get_all_registros_pago ({ response }: HttpContext) {
    try {
      const registros_pago = await this.service.get_all_pagos()
      return response.status(200).ok({ data: registros_pago })
    } catch (error) {
      return response.status(500).send({ message: 'Error al obtener los registros de pago', error: error.message })
    }
  }

  async get_registro_pago_id ({ params, response }: HttpContext) {
    try {
      const registro_pago = await this.service.get_pago_id(params.id)
      return response.status(200).ok({ data: registro_pago })
    } catch (error) {
      return response.status(500).send({ message: 'Error al obtener el registro de pago', error: error.message })
    }
  }

  async subirImagen(file: any) {
    const upload = await cloudinary.uploader.upload(file.tmpPath!, {
      width: 1920,
      height: 1920,
      crop: 'limit',
      quality: 90,
    })
    return upload.secure_url
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
        'cobrador_id',
        'estado',
        'numero_recibo',
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
      const urlFoto = foto ? await this.subirImagen(foto) : undefined
      const data = {
        ...request.only([
          'monto',
          'fecha_inicio',
          'fecha_pago',
          'fecha_fin',
          'membresia_id',
          'forma_pago_id',
          'cobrador_id',
          'estado',
          'numero_recibo',
        ]),
        ...(urlFoto && { foto: urlFoto }),
      }
      const res = await this.service.update_pago(params.id, data as PostRegistroPago)
      const pago = await this.service.get_pago_id(res.id_registro)
      return response.status(200).ok({ message: 'Registro de pago actualizado exitosamente', data: pago })
    } catch (error) {
      return response.status(500).send({ message: 'Error al actualizar el registro de pago', error: error.message })
    }
  }

  async delete_registro_pago ({ params, response }: HttpContext) {
    try {
      await this.service.delete_pago(params.id)
      return response.status(200).send({ message: 'Registro de pago eliminado exitosamente' })
    } catch (error) {
      return response.status(500).send({ message: 'Error al eliminar el registro de pago', error: error.message })
    }
  }

  async get_pagos_by_membresia({ params, response }: HttpContext) {
    const { id } = params
    try {
      const pagos = await this.service.get_pagos_by_membresia(id)
      return response.status(200).send({ data: pagos, message: 'Pagos obtenidos exitosamente' })
    } catch (error) {
      return response.status(500).json({ error: error.message, message: 'Ha ocurrido un error al obtener los pagos' })
    }
  }

  // ===== ANALÍTICA (2 endpoints) =====

  /** GET /registros-pago/ingresos/mes-total/:period  (period = YYYY-MM) */
  async ingresos_mes_total_slug({ params, response }: HttpContext) {
    try {
      const raw: string = String(params.period || '').trim()
      const m = raw.match(/^(\d{4})-(\d{2})$/)
      if (!m) {
        return response.badRequest({ error: 'Formato inválido. Usa YYYY-MM, por ejemplo 2025-02.' })
      }
      const year = Number(m[1])
      const month = Number(m[2])
      if (month < 1 || month > 12) {
        return response.badRequest({ error: 'Mes inválido. Debe ser 01..12.' })
      }
      const total = await this.service.totalIngresosMes({ year, month })
      return response.ok({ year, month, total })
    } catch (error) {
      return response.status(500).send({ message: 'Error al calcular el dinero total del mes', error: (error as any).message })
    }
  }

  /** 
   * GET /registros-pago/ingresos/mensual
   * GET /registros-pago/ingresos/mensual?year=2025
   * Si no envías year, toma el año actual.
   */
  async ingresos_mensual({ request, response }: HttpContext) {
    try {
      const raw = request.qs().year
      const parsed = Number(raw)
      const year = Number.isFinite(parsed) ? parsed : new Date().getFullYear()

      const data = await this.service.ingresosSerieMensual({ year })
      return response.ok({ year, data })
    } catch (error) {
      return response.status(500).send({ message: 'Error al obtener los ingresos mensuales', error: (error as any).message })
    }
  }

  
  async getPagosAsigandosByUser({params, response}: HttpContext){
    try {
      const {id_usuario} = params;
      const pagos = await this.service.getPagosAsiganadosByUser(id_usuario);
      return response.status(200).send({message: 'Pagos asigandos cargados corractamente', data: pagos})
    } catch (error) {
      return response.status(500).send({message: 'Ocurrió un error al obtener los pagos',  error: error.message})
    }
  }

  async setEstadoPago({params, response}: HttpContext){
    try {
      const {id_pago, estado} = params;
      const pago = await this.service.setEstadoPago(estado, id_pago)
      if(estado == 'Aprobado'){
        const contrato = await Membresia.find(pago?.membresia_id)
        if(!contrato) return
        contrato.estado = true;
        await contrato.save();
      }
      return response.status(200).send({message: 'Estado actualizado correctamente'})
    } catch (error) {
      return response.status(500).send({message: 'Error al cambiar el estado'});
    }
  }

  async subirEvidencia({params, request, response}: HttpContext){
    const foto = request.file('evidencia');
    const {id_pago} = params
    try {
      const url = await this.subirImagen(foto); // se carga la foto al cloud y retorna la url
      const data = await this.service.subirFoto(url, Number(id_pago)); // se actualiza la foto del pago
      return response.status(200).send({message: 'Evidencia cargada correctamente', data: data})
    } catch (error) {
      return response.status(500).send({message: 'Error al cargar la evidencia', error: error.message})
    }
  }
}
