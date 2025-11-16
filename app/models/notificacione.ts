import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Notificacione extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column() declare paciente_id:string
  @column() declare medico_id:number

  @column() declare registro_pago_id:number
  @column() declare cobrador_id:number
  
  
  @column() declare estado:boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}