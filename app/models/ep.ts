import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class Ep extends BaseModel {
  @column({ isPrimary: true })
  declare id_eps: number

  @column() declare nombre_eps: string
  @column() declare estado: boolean

  @hasMany(()=> Usuario)
    declare usuarios: HasMany<typeof Usuario>
}
