import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PlanXBeneficio from './plan_x_beneficio.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Beneficio extends BaseModel {
  @column({ isPrimary: true })
  declare id_beneficio: number

  @column() declare tipo_beneficio: string

  @hasMany(() => PlanXBeneficio)
  declare planXBeneficios: HasMany<typeof PlanXBeneficio>
}
