import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Paciente from './paciente.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Membresia from './membresia.js'

export default class MembresiaXPaciente extends BaseModel {
  public static table='membresia_x_paciente'

  @column({ isPrimary: true })
  declare id_membresia_x_paciente: number

  @column() declare paciente_id:number
  @column() declare membresia_id:number

  @belongsTo(()=> Paciente,{foreignKey:'paciente_id'})
  declare paciente: BelongsTo<typeof Paciente>
  
  @belongsTo(()=> Membresia,{foreignKey:'membresia_id'})
  declare membresia: BelongsTo<typeof Membresia>
  
}