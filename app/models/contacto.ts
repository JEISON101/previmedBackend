import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Contacto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column() declare telefonouno:string
  @column() declare telefonodos:string
  @column() declare ubicacion:string
  @column() declare emailuno:string
  @column() declare emaildos:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}