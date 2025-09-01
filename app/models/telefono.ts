import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Telefono extends BaseModel {
  @column({ isPrimary: true })
  declare id_telefono: number

  @column() declare telefono: string
  @column() declare usuario_id: string

  @belongsTo(()=> Usuario,{foreignKey:'usuario_id'})
  declare usuario: BelongsTo<typeof Usuario>
  
}