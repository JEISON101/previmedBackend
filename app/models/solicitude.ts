import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { TipoSolicitud } from '../interfaces/solicitudes.js'

export default class Solicitude extends BaseModel {
  @column({ isPrimary: true })
  declare id_solicitud: number

  @column() declare nombre: string
  @column() declare email: string
  @column() declare autorizacion_datos: boolean
  @column() declare telefono: string
  @column() declare descripcion: string
  @column() declare usuario_id: string 
  @column() declare segundo_nombre: string
  @column() declare apellido: string
  @column() declare segundo_apellido: string
  @column() declare estado: boolean
  @column() declare tipo_solicitud: TipoSolicitud
}