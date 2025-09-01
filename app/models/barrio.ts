import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Visita from './visita.js'

export default class Barrio extends BaseModel {
  @column({ isPrimary: true })
  declare id_barrio: number

  @column() declare nombre_barrio: string
  @column() declare latitud: number
  @column() declare longitud: number
  @column() declare estado: boolean

  @hasMany(()=> Visita)
    declare visitas: HasMany<typeof Visita>
}
