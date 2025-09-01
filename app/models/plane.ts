import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PlanXBeneficio from './plan_x_beneficio.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Membresia from './membresia.js'

export default class Plane extends BaseModel {
  @column({ isPrimary: true })
  declare id_plan: number

  @column() declare tipo_plan: string
  @column() declare descripcion: string
  @column() declare precio: number
  @column() declare estado: boolean
  @column() declare cantidad_beneficiarios: number
  @hasMany(() => PlanXBeneficio)
  declare planXBeneficios: HasMany<typeof PlanXBeneficio>
  @hasMany(() => Membresia)
  declare membresias: HasMany<typeof Membresia>
}
