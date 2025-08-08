import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Auditoria extends BaseModel {
  @column({ isPrimary: true })
  declare id_auditoria: number

  @column() declare tabla: string
  @column() declare accion: string
  @column() declare usuario_id: string
  @column() declare registro_id: string
  @column.dateTime({ autoCreate: true })
  declare created: DateTime
}
