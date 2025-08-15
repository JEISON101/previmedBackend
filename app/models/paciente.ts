import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Visita from './visita.js'
import MembresiaXPaciente from './membresia_x_paciente.js'

export default class Paciente extends BaseModel {


  @column({ isPrimary: true })
  declare id_paciente: number

  @column() declare direccion_cobro: string
  @column() declare ocupacion: string
  @column() declare activo: boolean
  @column() declare beneficiario: boolean
  @column() declare usuario_id: number
  @column() declare paciente_id: number

  @belongsTo(() => Usuario, { foreignKey: 'usuario_id' })
  declare usuario: BelongsTo<typeof Usuario>

  @hasMany(() => Paciente)
  declare pacientes: HasMany<typeof Paciente>

  @belongsTo(() => Paciente, { foreignKey: 'paciente_id' })
  declare paciente: BelongsTo<typeof Paciente>

  @hasMany(() => Visita)
  declare visitas: HasMany<typeof Visita>

  @hasMany(() => MembresiaXPaciente)
  declare membresiaPaciente: HasMany<typeof MembresiaXPaciente>
}
