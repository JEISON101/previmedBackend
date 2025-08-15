// app/controllers/PacientesController.ts
import { HttpContext } from '@adonisjs/core/http'
import PacientesService from '#services/PacientesServices'

export default class PacientesController {
  private pacientesService = new PacientesService()

  /**
   * Lista todos los pacientes, precargando la información de su usuario.
   */
  async index({ response }: HttpContext) {
    try {
      const pacientes = await this.pacientesService.findAll()
      return response.ok(pacientes)
    } catch (error) {
      console.error('Error al listar pacientes:', error)
      return response.internalServerError({ message: 'Error al obtener los pacientes.' })
    }
  }

  /**
   * Obtiene un paciente por su ID, precargando la información de su usuario.
   */
  async show({ params, response }: HttpContext) {
    try {
      const paciente = await this.pacientesService.findById(params.id)
      if (!paciente) {
        return response.notFound({ message: 'Paciente no encontrado.' })
      }
      return response.ok(paciente)
    } catch (error) {
      console.error(`Error al obtener paciente con ID ${params.id}:`, error)
      return response.internalServerError({ message: 'Error al obtener el paciente.' })
    }
  }

  /**
   * Crea un nuevo paciente.
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'direccion_cobro',
        'ocupacion',
        'activo',
        'beneficiario',
        'usuario_id',
        'paciente_id' // Si aplica, para el caso de beneficiarios de otro paciente
      ])

      const newPaciente = await this.pacientesService.create(data)
      return response.created(newPaciente)
    } catch (error) {
      console.error('Error al crear paciente:', error)
      return response.internalServerError({ message: 'Error al crear el paciente.' })
    }
  }

  /**
   * Actualiza un paciente existente.
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'direccion_cobro',
        'ocupacion',
        'activo',
        'beneficiario',
        'usuario_id',
        'paciente_id'
      ])

      const updatedPaciente = await this.pacientesService.update(params.id, data)
      if (!updatedPaciente) {
        return response.notFound({ message: 'Paciente no encontrado para actualizar.' })
      }
      return response.ok(updatedPaciente)
    } catch (error) {
      console.error(`Error al actualizar paciente con ID ${params.id}:`, error)
      return response.internalServerError({ message: 'Error al actualizar el paciente.' })
    }
  }

  /**
   * Elimina un paciente.
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const success = await this.pacientesService.delete(params.id)
      if (!success) {
        return response.notFound({ message: 'Paciente no encontrado para eliminar.' })
      }
      return response.noContent() // 204 No Content para eliminación exitosa
    } catch (error) {
      console.error(`Error al eliminar paciente con ID ${params.id}:`, error)
      return response.internalServerError({ message: 'Error al eliminar el paciente.' })
    }
  }
}