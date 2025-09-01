import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ModuloXRol from './modulo_x_rol.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id_rol: number

  @column() declare nombre_rol: string
  @column() declare estado: boolean

  @hasMany(()=> ModuloXRol)
  declare roles: HasMany<typeof ModuloXRol>

  @hasMany(()=> Usuario)
  declare usuarios: HasMany<typeof Usuario>
}
