import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Plane from './plane.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import MembresiaXPaciente from './membresia_x_paciente.js'
import RegistrosPago from './registros_pago.js'

export default class Membresia extends BaseModel {
  @column({ isPrimary: true })
  declare id_membresia: number

  @column() declare firma: string
  @column() declare forma_pago: string
  @column() declare numero_contrato: string
  @column() declare fecha_inicio: Date
  @column() declare fecha_fin: Date
  @column() declare estado: boolean
  @column() declare plan_id: string

  @belongsTo(() => Plane, { foreignKey: 'plan_id' })
  declare plan: BelongsTo<typeof Plane>

  @hasMany(() => MembresiaXPaciente)
  declare membresiaPaciente: HasMany<typeof MembresiaXPaciente>
  
  @hasMany(() => RegistrosPago)
  declare registrosPagos: HasMany<typeof RegistrosPago>
}
