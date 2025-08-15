import RegistrosPago from '#models/registros_pago'

export default class RegistrosPagoService {
async get_all_pagos() {
  return await RegistrosPago.query()
    .preload('formaPago')
    .preload('membresia', (membresiaQuery) => {
      membresiaQuery.preload('membresiaPaciente', (mxpQuery) => {
        mxpQuery.preload('paciente', (pacienteQuery) => {
          pacienteQuery.preload('usuario')
        })
      })
    })
}


  async get_pago_id(id: number) {
    return await RegistrosPago.query()
      .where('id_registro', id)
      .preload('formaPago')
      .preload('membresia',(membresiaQuery) => {
      membresiaQuery.preload('membresiaPaciente', (mxpQuery) => {
        mxpQuery.preload('paciente', (pacienteQuery) => {
          pacienteQuery.preload('usuario')
        })
      })
    })
    .firstOrFail()
  }

  async create_pago(data: any) {
    return await RegistrosPago.create(data)
  }

  async update_pago(id: number, data: any) {
    const registro = await RegistrosPago.findOrFail(id)
    registro.merge(data)
    await registro.save()
    return registro
  }

  async delete_pago(id: number) {
    const registro = await RegistrosPago.findOrFail(id)
    await registro.delete()
  }
}
