import RegistrosPago from '#models/registros_pago'
import { PostRegistroPago } from '../interfaces/registros_pagos.js'

export default class RegistrosPagoService {
  async get_all_pagos() {
    return await RegistrosPago.query()
      .select()
      .preload('formaPago', (fpquery)=>fpquery.select('tipo_pago'))
      .preload('cobrador')
      .preload('membresia', (membresiaQuery) => {
        membresiaQuery
          .select('numero_contrato')
          .preload('membresiaPaciente', (mxpQuery) => {
            mxpQuery.preload('paciente', (pacienteQuery) => {
              pacienteQuery.select('direccion_cobro','usuario_id')
              .preload('usuario', (usuarioQuery) => {
                usuarioQuery.select(
                  'id_usuario',
                  'nombre',
                  'segundo_nombre',
                  'apellido',
                  'segundo_apellido',
                  'email'
                )
              })
            })
          })
      })
  }

  async get_pago_id(id: number) {
    return await RegistrosPago.query()
      .where('id_registro', id)
      .preload('formaPago', (fpquery)=>fpquery.select('tipo_pago'))
      .preload('cobrador')
      .preload('membresia', (membresiaQuery) => {
        membresiaQuery
          .select('numero_contrato')
          .preload('membresiaPaciente', (mxpQuery) => {
            mxpQuery.preload('paciente', (pacienteQuery) => {
              pacienteQuery.select('direccion_cobro','usuario_id')
              .preload('usuario', (usuarioQuery) => {
                usuarioQuery.select(
                  'id_usuario',
                  'nombre',
                  'segundo_nombre',
                  'apellido',
                  'segundo_apellido',
                  'email'
                )
              })
            })
          })
      })
      .firstOrFail()
  }

  async create_pago(data: PostRegistroPago) {
    return await RegistrosPago.create(data)
  }

  async update_pago(id: number, data: PostRegistroPago) {
    const registro = await RegistrosPago.findOrFail(id)
    registro.merge(data)
    await registro.save()
    return registro
  }

  async delete_pago(id: number) {
    const registro = await RegistrosPago.findOrFail(id)
    await registro.delete()
  }

  async get_pagos_by_membresia(id: number) {
    const pagos = await RegistrosPago.query()
    .where('membresia_id', id)
    .preload('formaPago')
    .orderBy('id_registro', 'desc')
    return pagos
  }
}
