import RegistrosPago from '#models/registros_pago'
import { PostRegistroPago } from '../interfaces/registros_pagos.js'
import db from '@adonisjs/lucid/services/db'

export default class RegistrosPagoService {
  async get_all_pagos() {
    return await RegistrosPago.query()
      .select()
      .preload('formaPago', (fpquery) => fpquery.select('tipo_pago'))
      .preload('membresia', (membresiaQuery) => {
        membresiaQuery
          .select('numero_contrato')
          .preload('membresiaPaciente', (mxpQuery) => {
            mxpQuery.preload('paciente', (pacienteQuery) => {
              pacienteQuery
                .select('direccion_cobro', 'usuario_id')
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
      .preload('formaPago', (fpquery) => fpquery.select('tipo_pago'))
      .preload('membresia', (membresiaQuery) => {
        membresiaQuery
          .select('numero_contrato')
          .preload('membresiaPaciente', (mxpQuery) => {
            mxpQuery.preload('paciente', (pacienteQuery) => {
              pacienteQuery
                .select('direccion_cobro', 'usuario_id')
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

  // ====== ANALÍTICA ======

  /** Total de ingresos del mes (usa fecha_pago – DATE). */
  async totalIngresosMes(params: { year: number; month: number }): Promise<number> {
    const { year, month } = params

    // Rango [inicio de mes, inicio del mes siguiente) en YYYY-MM-DD (UTC)
    const start = new Date(Date.UTC(year, month - 1, 1))
    const next  = new Date(Date.UTC(year, month, 1))
    const toYMD = (d: Date) => {
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    const startStr = toYMD(start)
    const nextStr  = toYMD(next)

    const [row] = await db
      .from('registros_pagos')
      .where('fecha_pago', '>=', startStr)
      .andWhere('fecha_pago', '<',  nextStr)
      .sum('monto as total')

    return Number((row as any)?.total ?? 0)
  }

  /** Serie mensual del año (YYYY-MM -> suma de monto), usando fecha_pago. */
  async ingresosSerieMensual(params: { year: number })
  : Promise<Array<{ label: string; value: number }>> {
    const { year } = params

    const rows = await db
      .from('registros_pagos')
      .whereRaw('EXTRACT(YEAR FROM fecha_pago) = ?', [year])
      .select(
        db.raw('EXTRACT(YEAR FROM fecha_pago) as y'),
        db.raw('EXTRACT(MONTH FROM fecha_pago) as m')
      )
      .sum('monto as value')
      .groupBy('y', 'm')
      .orderBy('y', 'asc')
      .orderBy('m', 'asc')

    return rows.map((r: any) => ({
      label: `${Number(r.y)}-${String(Number(r.m)).padStart(2, '0')}`,
      value: Number(r.value),
    }))
  }
}
