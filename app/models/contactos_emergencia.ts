import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Paciente from './paciente.js'
import type
 { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ContactosEmergencia extends BaseModel {
  @column({ isPrimary: true })
  declare id_contacto: number

  @column() declare nombre: string
  @column() declare apellido:string
  @column() declare parentesco:string
  @column() declare telefono:string
  @column() declare paciente_id:number

  @belongsTo(()=>Paciente,{foreignKey:'paciente_id'})
  declare paciente: BelongsTo<typeof Paciente>
}