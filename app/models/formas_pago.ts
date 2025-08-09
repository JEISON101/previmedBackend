import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import RegistrosPago from './registros_pago.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class FormasPago extends BaseModel {
  @column({ isPrimary: true })
  declare id_forma_pago: number

  @column() declare tipo_pago: string
  @column() declare estado: boolean

  @hasMany(() => RegistrosPago)
    declare registrosPagos: HasMany<typeof RegistrosPago>
}
