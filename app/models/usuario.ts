import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { TipoDocumento, TipoEstadoCivil, TipoGenero } from '../interfaces/usuarios.js'
import Ep from './ep.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Medico from './medico.js'
import Paciente from './paciente.js'
import Telefono from './telefono.js'

export default class Usuario extends BaseModel {
  id: any
  static findOne(arg0: { where: { numero_documento: string } }) {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  declare id_usuario: number

  @column() declare nombre: string
  @column() declare segundo_nombre: string
  @column() declare apellido: string
  @column() declare segundo_apellido: string
  @column() declare email: string
  @column() declare password: string
  @column() declare direccion: string
  @column() declare numero_documento: string
  @column() declare fecha_nacimiento: Date
  @column() declare numero_hijos: number
  @column() declare estrato: number
  @column() declare autorizacion_datos: boolean
  @column() declare habilitar: boolean
  @column() declare genero: TipoGenero
  @column() declare estado_civil: TipoEstadoCivil
  @column() declare tipo_documento: TipoDocumento
  @column() declare eps_id: number
  @column() declare rol_id: number

  @belongsTo(()=> Ep, {foreignKey:'eps_id'})
  declare eps: BelongsTo<typeof Ep>

  @belongsTo(()=> Role, {foreignKey:'rol_id'})
  declare rol: BelongsTo<typeof Role>

  @hasMany(()=> Medico)
  declare medicos: HasMany<typeof Medico>

  @hasMany(()=> Paciente)
  declare pacientes: HasMany<typeof Paciente>

  @hasMany(()=> Telefono)
  declare telefonos: HasMany<typeof Telefono>
}