// app/services/PacientesService.ts
import Paciente from '#models/paciente'
import { DateTime } from 'luxon' // Importa DateTime si lo necesitas para fechas, aunque aquí no se usa directamente

export default class PacientesService {
  /**
   * Lista todos los pacientes, precargando la relación con el usuario.
   */
  async findAll() {
    return await Paciente.query().preload('usuario')
  }

  /**
   * Busca un paciente por su ID, precargando la relación con el usuario.
   */
  async findById(id: number) {
    return await Paciente.query().where('id_paciente', id).preload('usuario').first()
  }

  /**
   * Crea un nuevo paciente.
   * @param data Datos del paciente a crear.
   */
  async create(data: Partial<Paciente>) {
    // Asegúrate de que los campos booleanos se manejen correctamente si vienen como strings
    const pacienteData = {
      ...data,
      activo: data.activo === undefined ? true : Boolean(data.activo), // Por defecto activo: true
      beneficiario: Boolean(data.beneficiario),
      usuario_id: Number(data.usuario_id),
      paciente_id: data.paciente_id ? Number(data.paciente_id) : undefined // Opcional
    }
    const paciente = await Paciente.create(pacienteData)
    // Precarga el usuario para devolverlo en la respuesta
    await paciente.load('usuario')
    return paciente
  }

  /**
   * Actualiza un paciente existente.
   * @param id ID del paciente a actualizar.
   * @param data Datos parciales del paciente.
   */
  async update(id: number, data: Partial<Paciente>) {
    const paciente = await Paciente.find(id)
    if (!paciente) {
      return null
    }

    const updateData = {
      ...data,
      // Convierte a booleano si es necesario
      activo: data.activo !== undefined ? Boolean(data.activo) : paciente.activo,
      beneficiario: data.beneficiario !== undefined ? Boolean(data.beneficiario) : paciente.beneficiario,
      usuario_id: data.usuario_id !== undefined ? Number(data.usuario_id) : paciente.usuario_id,
      paciente_id: data.paciente_id !== undefined ? Number(data.paciente_id) : paciente.paciente_id,
    }

    paciente.merge(updateData)
    await paciente.save()
    // Precarga el usuario para devolverlo en la respuesta
    await paciente.load('usuario')
    return paciente
  }

  /**
   * Elimina un paciente por su ID.
   * @param id ID del paciente a eliminar.
   */
  async delete(id: number): Promise<boolean> {
    const paciente = await Paciente.find(id)
    if (!paciente) {
      return false
    }
    await paciente.delete()
    return true
  }
}