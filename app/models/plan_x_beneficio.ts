import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Plane from './plane.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Beneficio from './beneficio.js'

export default class PlanXBeneficio extends BaseModel {
  @column({ isPrimary: true })
  declare id_plan_x_beneficios: number

  @column() declare plan_id: number
  @column() declare beneficio_id: number

  @belongsTo(()=> Plane)
  declare plan: BelongsTo<typeof Plane>
  
  @belongsTo(()=> Beneficio)
  declare beneficio: BelongsTo<typeof Beneficio>
}