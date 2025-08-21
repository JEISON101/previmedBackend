export interface CreateMedicoData {
  disponibilidad: boolean
  estado?: boolean
  usuario_id: string
}

export interface UpdateMedicoData {
  disponibilidad?: boolean
  estado?: boolean
}

export interface MedicoFilters {
  disponibilidad?: boolean
  estado?: boolean
  usuario_id?: string
}

export interface MedicoResponse {
  id_medico: number
  disponibilidad: boolean
  estado: boolean
  usuario_id: string
  usuario?: {
    id_usuario: string
    nombre: string
    apellido: string
    email: string
    numero_documento: string
  }
}
export interface MedicoServiceInterface {
  obtenerTodos(filtros?: MedicoFilters): Promise<MedicoResponse[]>
  obtenerPorId(id: number): Promise<MedicoResponse | null>
  crear(data: CreateMedicoData): Promise<MedicoResponse>
  actualizar(id: number, data: UpdateMedicoData): Promise<MedicoResponse | null>
  eliminar(id: number): Promise<boolean>
  cambiarDisponibilidad(id: number, disponible: boolean): Promise<MedicoResponse | null>
  obtenerDisponibles(): Promise<MedicoResponse[]>
}