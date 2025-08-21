
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Visita from './visita.js'

export default class Medico extends BaseModel {
  @column({ isPrimary: true })
  declare id_medico: number

  @column() declare disponibilidad: boolean
  @column() declare estado: boolean
  @column() declare usuario_id: string

  @belongsTo(()=> Usuario, {foreignKey:'usuario_id'})
  declare usuario: BelongsTo<typeof Usuario>

  @hasMany(()=> Visita)
  declare visitas: HasMany<typeof Visita>
}