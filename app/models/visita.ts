import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Paciente from './paciente.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Medico from './medico.js'
import Barrio from './barrio.js'

export default class Visita extends BaseModel {
  @column({ isPrimary: true })
  declare id_visita: number

  @column() declare fecha_visita: DateTime
  @column() declare descripcion: string
  @column() declare direccion: string
  @column() declare estado: boolean
  @column() declare telefono: string
  @column() declare paciente_id: number
  @column() declare medico_id: number
  @column() declare barrio_id: number

  @belongsTo(()=> Paciente, { foreignKey:'paciente_id'})
  declare paciente: BelongsTo<typeof Paciente>

  @belongsTo(()=> Medico, {foreignKey:'medico_id'})
  declare medico: BelongsTo<typeof Medico>

  @belongsTo(()=> Barrio, {foreignKey:'medico_id'})
  declare barrio: BelongsTo<typeof Barrio>
}
