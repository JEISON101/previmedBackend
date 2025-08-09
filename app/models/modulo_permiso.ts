import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ModuloXRol from './modulo_x_rol.js'

export default class ModuloPermiso extends BaseModel {
  @column({ isPrimary: true })
  declare id_modulo: number

  @column() declare modulo: string
  @column() declare url_modulo: string
  @column() declare icono_modulo: string
  @column() declare orden: number
  @column() declare id_modulo_padre: number

  @hasMany(() => ModuloPermiso)
  declare permisos: HasMany<typeof ModuloPermiso>

  @belongsTo(() => ModuloPermiso, {
    foreignKey: 'id_modulo_padre',
  })
  declare permiso: BelongsTo<typeof ModuloPermiso>

  @hasMany(()=> ModuloXRol)
  declare roles: HasMany<typeof ModuloXRol>
}
