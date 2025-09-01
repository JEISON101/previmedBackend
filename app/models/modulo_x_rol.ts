import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ModuloPermiso from './modulo_permiso.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

export default class ModuloXRol extends BaseModel {

  @column({ isPrimary: true })
  declare id_modulo_x_rol: number

  @column() declare id_rol: number
  @column() declare id_modulo: number
  @column() declare permiso: string

  @belongsTo(()=> Role, { foreignKey:'id_rol'})
  declare rol: BelongsTo<typeof Role>

  @belongsTo(()=> ModuloPermiso, { foreignKey:'id_modulo'})
  declare modulo: BelongsTo<typeof ModuloPermiso>


}