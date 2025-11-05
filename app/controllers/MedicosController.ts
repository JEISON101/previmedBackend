import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import MedicoService from '#services/MedicosServices'
import UsuarioServices from '../services/UsuariosServices.js'

@inject()
export default class MedicosController {
  constructor(private medicoService: MedicoService) {}

  // Validadores
  private createValidator = vine.compile(
    vine.object({
      disponibilidad: vine.boolean(),
      estado: vine.boolean().optional(),
      usuario_id: vine.string().trim().minLength(1)
    })
  )

  private updateValidator = vine.compile(
    vine.object({
      disponibilidad: vine.boolean().optional(),
      estado: vine.boolean().optional()
    })
  )

  private queryValidator = vine.compile(
    vine.object({
      disponibilidad: vine.boolean().optional(),
      estado: vine.boolean().optional(),
      usuario_id: vine.string().optional(),
      page: vine.number().min(1).optional(),
      limit: vine.number().min(1).max(100).optional()
    })
  )

  /**
   * GET /medicos
   * Obtener todos los médicos con filtros opcionales y paginación
   */
  async readAll({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, ...filtros } = await request.validateUsing(this.queryValidator)
      
      if (page && limit) {
        // Con paginación
        const medicos = await this.medicoService.obtenerTodos(filtros)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedResults = medicos.slice(startIndex, endIndex)
        
        return response.ok({
          data: paginatedResults,
          meta: {
            total: medicos.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(medicos.length / limit)
          }
        })
      } else {
        // Sin paginación
        const medicos = await this.medicoService.obtenerTodos(filtros)
        return response.ok({
          data: medicos
        })
      }
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener médicos',
        error: error.messages || error.message
      })
    }
  }

  /**
   * GET /medicos/:id
   * Obtener un médico por ID
   */
  async readId({ params, response }: HttpContext) {
    try {
      const medico = await this.medicoService.obtenerPorId(params.id)
      
      if (!medico) {
        return response.notFound({
          message: 'Médico no encontrado'
        })
      }

      return response.ok({
        data: medico
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener médico',
        error: error.message
      })
    }
  }

  /**
   * POST /medicos
   * Crear un nuevo médico
   */
  async create({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(this.createValidator)
      const medico = await this.medicoService.crear(data)

      return response.created({
        message: 'Médico creado exitosamente',
        data: medico
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Datos inválidos',
          errors: error.messages
        })
      }

      return response.internalServerError({
        message: 'Error al crear médico',
        error: error.message
      })
    }
  }

  /**
   * PUT /medicos/:id
   * Actualizar un médico
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(this.updateValidator)
      const medico = await this.medicoService.actualizar(params.id, data)

      if (!medico) {
        return response.notFound({
          message: 'Médico no encontrado'
        })
      }

      return response.ok({
        message: 'Médico actualizado exitosamente',
        data: medico
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Datos inválidos',
          errors: error.messages
        })
      }

      return response.internalServerError({
        message: 'Error al actualizar médico',
        error: error.message
      })
    }
  }

  /**
   * DELETE /medicos/:id
   * Eliminar un médico
   */
  async delete({ params, response }: HttpContext) {
    try {
      const eliminado = await this.medicoService.eliminar(params.id)

      if (!eliminado) {
        return response.notFound({
          message: 'Médico no encontrado'
        })
      }

      return response.ok({
        message: 'Médico eliminado exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al eliminar médico',
        error: error.message
      })
    }
  }

  /**
   * PATCH /medicos/:id/disponibilidad
   * Cambiar disponibilidad de un médico
   */
  async cambiarDisponibilidad({ params, request, response }: HttpContext) {
    try {
      const validator = vine.compile(
        vine.object({
          disponible: vine.boolean()
        })
      )

      const { disponible } = await request.validateUsing(validator)
      const medico = await this.medicoService.cambiarDisponibilidad(params.id, disponible)

      if (!medico) {
        return response.notFound({
          message: 'Médico no encontrado'
        })
      }

      return response.ok({
        message: `Médico ${disponible ? 'habilitado' : 'deshabilitado'} exitosamente`,
        data: medico
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Datos inválidos',
          errors: error.messages
        })
      }

      return response.internalServerError({
        message: 'Error al cambiar disponibilidad',
        error: error.message
      })
    }
  }

  /**
   * GET /medicos/disponibles
   * Obtener médicos disponibles
   */
  async disponibles({ response }: HttpContext) {
    try {
      const medicos = await this.medicoService.obtenerDisponibles()
      
      return response.ok({
        data: medicos
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener médicos disponibles',
        error: error.message
      })
    }
  }

  //GET /medicos/usuario/:usuario_id 
  async listarPorUsuario({ params, response }: HttpContext) {
    try {
      const medico = await this.medicoService.obtenerPorUsuarioId(params.usuario_id)

      if (!medico) {
        return response.notFound({ message: 'Médico no encontrado' })
      }

      return response.ok({ msj: medico })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener médico por usuario_id',
        error: error.message,
      })
    }
  }


  // POST /medicos/usuario
  async crearUsuarioMedico({ request, response }: HttpContext) {
    try {
      const validator = vine.compile(
        vine.object({
          nombre: vine.string().trim().optional(),
          segundo_nombre: vine.string().trim().optional(),
          apellido: vine.string().trim().optional(),
          segundo_apellido: vine.string().trim().optional(),
          email: vine.string().trim().email().optional(),
          password: vine.string().minLength(8),
          numero_documento: vine.string().trim().minLength(1),
          direccion: vine.string().trim().optional(),
          habilitar: vine.boolean().optional(),
          autorizacion_datos: vine.boolean().optional(),
          genero: vine.string().optional(),
          estado_civil: vine.string().optional(),
          tipo_documento: vine.string().optional(),
          eps_id: vine.number().optional(),
          estrato: vine.string().optional(),
          numero_hijos: vine.string().optional(),
          fecha_nacimiento: vine.string().optional(),
        })
      )

      const data = await request.validateUsing(validator)

      const usuarioSvc = new UsuarioServices()
      const existente = await usuarioSvc.doc(data.numero_documento)
      if (existente) {
        return response.status(409).json({ msg: 'Ya existe un usuario con este número de documento' })
      }

      const MEDICO_ROLE_ID = 2
      const toCreate = {
        ...data,
        rol_id: MEDICO_ROLE_ID,
        habilitar: data.habilitar ?? true,
        autorizacion_datos: data.autorizacion_datos ?? true,
      }

      const usuario = await usuarioSvc.create(toCreate)

      return response.status(200).json({
        msg: 'Médico creado en usuarios',
        data: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          numero_documento: usuario.numero_documento,
          rol_id: usuario.rol_id,
        },
      })
    } catch (error: any) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({ msg: 'Datos inválidos', errors: error.messages })
      }
      return response.status(500).json({ msg: 'Error interno.', error: error.message })
    }
  } 
}
