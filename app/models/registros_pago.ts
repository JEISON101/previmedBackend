import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Membresia from './membresia.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FormasPago from './formas_pago.js'

export default class RegistrosPago extends BaseModel {
  @column({ isPrimary: true })
  declare id_registro: number

  @column() declare monto: number
  @column() declare foto: string
  @column() declare fecha_inicio: Date
  @column() declare fecha_fin: Date
  @column() declare membresia_id: number
  @column() declare forma_pago_id: number

  @belongsTo(()=> Membresia, {foreignKey:'membresia_id'})
  declare membresia: BelongsTo<typeof Membresia>

  @belongsTo(()=> FormasPago, {foreignKey:'forma_pago_id'})
  declare formaPago: BelongsTo<typeof FormasPago>
  
}