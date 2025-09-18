//interfaces

//lo que va a llegar
export interface TelefonoEntity {
  id_telefono: number
  telefono: string
  usuario_id: string
}

//oara crear
export interface CrearTelefonoDto {
  telefono: string
  usuario_id: string
}

//para actualizar
export interface UpdateTelefonoDto {
  id_telefono: number
  telefono?: string
  usuario_id?: string
}
