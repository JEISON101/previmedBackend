import PacientesServices from '#services/PacientesServices'
import { type HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const paciente = new PacientesServices()

export default class PacientesController {
  private service = new PacientesServices()

  // ✅ Crear paciente normal
  async create({ request, response }: HttpContext) {
    try {
      const id_usuario = uuidv4()
      const body = request.body()

      const userExist = await paciente.readByDoc(body.numero_documento)
      if (userExist) {
        return response.status(409).json({ message: 'El usuario ya se encuentra registrado' })
      }

      const hash = await bcrypt.hash(body.password || '123456', 10)

      const newPaciente = await paciente.create(
        {
          direccion_cobro: body.direccion_cobro || 'N/A',
          ocupacion: body.ocupacion || 'N/A',
          activo: body.activo ?? true,
          beneficiario: false,
          usuario_id: id_usuario,
        },
        {
          id_usuario,
          nombre: body.nombre,
          segundo_nombre: body.segundo_nombre || '',
          apellido: body.apellido,
          segundo_apellido: body.segundo_apellido || '',
          email: body.email,
          password: hash,
          direccion: body.direccion,
          numero_documento: body.numero_documento,
          fecha_nacimiento: body.fecha_nacimiento,
          numero_hijos: body.numero_hijos,
          estrato: body.estrato,
          autorizacion_datos: body.autorizacion_datos ?? true,
          habilitar: body.habilitar ?? true,
          genero: body.genero || 'Masculino',
          estado_civil: body.estado_civil || 'Soltero',
          tipo_documento: body.tipo_documento || 'Cédula de Ciudadanía',
          eps_id: body.eps_id || 1,
          rol_id: body.rol_id || 3,
        }
      )

      return response.status(201).json({ message: 'Creado', data: newPaciente })
    } catch (e) {
      console.error('❌ Error en create:', e)
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  // ✅ Obtener todos los pacientes
  async readAll({ response }: HttpContext) {
    try {
      const users = await paciente.read()
      return response.ok({ message: 'Información obtenida', data: users })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  // ✅ Crear beneficiario (vinculado a un titular)
  async createBeneficiario({ request, response }: HttpContext) {
    try {
      const id_usuario = uuidv4()
      const body = request.body()

      if (!body.paciente_id) {
        return response.status(400).json({ message: 'Debe seleccionar un titular' })
      }

      const userExist = await paciente.readByDoc(body.numero_documento)
      if (userExist) {
        return response.status(409).json({ message: 'El beneficiario ya existe' })
      }

      const hash = await bcrypt.hash(body.password || '123456', 10)
      const generoValido = ['Masculino', 'Femenino'].includes(body.genero)
        ? body.genero
        : 'Masculino'

      const newBeneficiario = await paciente.create(
        {
          direccion_cobro: 'N/A',
          ocupacion: 'N/A',
          activo: true,
          beneficiario: true,
          paciente_id: body.paciente_id,
          usuario_id: id_usuario,
        },
        {
          id_usuario,
          nombre: body.nombre,
          segundo_nombre: body.segundo_nombre || '',
          apellido: body.apellido,
          segundo_apellido: body.segundo_apellido || '',
          email: body.email || `${body.numero_documento}@mail.com`,
          password: hash,
          direccion: body.direccion || 'N/A',
          numero_documento: body.numero_documento,
          fecha_nacimiento: body.fecha_nacimiento || '2000-01-01',
          numero_hijos: body.numero_hijos || '0',
          estrato: body.estrato || '1',
          autorizacion_datos: true,
          habilitar: true,
          genero: generoValido,
          estado_civil: body.estado_civil || 'Soltero',
          tipo_documento: body.tipo_documento || 'Cédula de Ciudadanía',
          eps_id: body.eps_id || 1,
          rol_id: 4,
        }
      )

      return response.status(201).json({ message: 'Beneficiario creado', data: newBeneficiario })
    } catch (e) {
      console.error('❌ Error al crear beneficiario:', e)
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  // ✅ Leer beneficiarios
  async readBeneficiarios({ response }: HttpContext) {
    try {
      const data = await paciente.readBeneficiarios()
      return response.ok({ data })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  // ✅ Leer beneficiario por ID
  async readBeneficiarioById({ params, response }: HttpContext) {
    try {
      const { id } = params
      const data = await paciente.readBeneficiarioById(Number(id))

      if (!data) return response.status(404).json({ message: 'Beneficiario no encontrado' })

      return response.ok({ message: 'Beneficiario obtenido', data })
    } catch (error) {
      console.error('❌ Error al leer beneficiario por ID:', error)
      return response.status(500).json({ message: 'Error', error: error.message })
    }
  }

  // ✅ Actualizar beneficiario
  async updateBeneficiario({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const body = request.body()

      const hash = body.password
        ? await bcrypt.hash(body.password, 10)
        : await bcrypt.hash('temporal123', 10)

      const generoValido =
        body.genero === 'Femenino' || body.genero === 'Masculino' ? body.genero : 'Masculino'

      const userUpdate: any = {
        nombre: body.nombre,
        segundo_nombre: body.segundo_nombre || '',
        apellido: body.apellido,
        segundo_apellido: body.segundo_apellido || '',
        email: body.email,
        password: hash,
        direccion: body.direccion || 'N/A',
        numero_documento: body.numero_documento,
        fecha_nacimiento: body.fecha_nacimiento || '2000-01-01',
        numero_hijos: body.numero_hijos || '0',
        estrato: body.estrato || '1',
        autorizacion_datos: true,
        habilitar: true,
        genero: generoValido,
        estado_civil: body.estado_civil || 'Soltero',
        tipo_documento: body.tipo_documento || 'Cédula de Ciudadanía',
        eps_id: body.eps_id || 1,
        rol_id: 4,
      }

      const pacUpdate = {
        direccion_cobro: 'N/A',
        ocupacion: 'N/A',
        activo: true,
        beneficiario: true,
        paciente_id: body.paciente_id,
      }

      const updated = await paciente.update(Number(id), pacUpdate, userUpdate)
      return response.ok({ message: 'Beneficiario actualizado', data: updated })
    } catch (error) {
      console.error('❌ Error al actualizar beneficiario:', error)
      return response.status(500).json({ message: 'Error', error: error.message })
    }
  }

  // ✅ Eliminar beneficiario
  async deleteBeneficiario({ params, response }: HttpContext) {
    try {
      const { id } = params
      const deleted = await paciente.delete(Number(id))
      return response.ok({ message: 'Beneficiario eliminado', data: deleted })
    } catch (e) {
      if (e.message.includes('foreign key')) {
        return response.status(409).json({
          message: 'Error',
          error: 'No se puede eliminar: el beneficiario tiene registros vinculados',
        })
      }
      console.error('❌ Error al eliminar beneficiario:', e)
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
}
