import PacientesServices from '#services/PacientesServices'
import { type HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const paciente = new PacientesServices()

export default class PacientesController {
  async create({ request, response }: HttpContext) {
    try {
      const id_usuario = uuidv4()
      const {
        nombre,
        segundo_nombre,
        apellido,
        segundo_apellido,
        email,
        password,
        direccion,
        numero_documento,
        fecha_nacimiento,
        numero_hijos,
        estrato,
        autorizacion_datos,
        habilitar,
        genero,
        estado_civil,
        tipo_documento,
        eps_id,
        rol_id,
        direccion_cobro,
        ocupacion,
        activo,
        beneficiario,
        paciente_id,
      } = request.body()

      const userExist = await paciente.readByDoc(numero_documento)

      if (userExist) {
        return response.status(500).json({ message: 'El usuario ya se encuentra registrado' })
      }

      const hash = await bcrypt.hash(password, 10)

      const newPaciente = await paciente.create(
        {
          direccion_cobro,
          ocupacion,
          activo,
          beneficiario,
          paciente_id,
          usuario_id: id_usuario,
        },
        {
          id_usuario,
          nombre,
          segundo_nombre,
          apellido,
          segundo_apellido,
          email,
          password: hash,
          direccion,
          numero_documento,
          fecha_nacimiento,
          numero_hijos,
          estrato,
          autorizacion_datos,
          habilitar,
          genero,
          estado_civil,
          tipo_documento,
          eps_id,
          rol_id,
        }
      )
      return response.status(201).json({ message: 'Creado', data: newPaciente })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async readAll({ response }: HttpContext) {
    try {
      const users = await paciente.read()
      return response.status(201).json({ message: 'Información obtenida', data: users })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async readById({ params, response }: HttpContext) {
    try {
      const { id } = params
      const userid = await paciente.readById(id)
      return response.status(200).json({ message: 'Información obtenida', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async readByITitular({  response }: HttpContext) {
    try {
      const userTi = await paciente.readByTitular()
      return response.status(200).json({ message: 'Información obtenida', data: userTi })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async deleteById({ params, response }: HttpContext) {
    try {
      const { id } = params
      const userid = await paciente.delete(id)
      return response.status(200).json({ message: 'Eliminado', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async updateById({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const {
        nombre,
        segundo_nombre,
        apellido,
        segundo_apellido,
        email,
        password,
        direccion,
        numero_documento,
        fecha_nacimiento,
        numero_hijos,
        estrato,
        autorizacion_datos,
        habilitar,
        genero,
        estado_civil,
        tipo_documento,
        eps_id,
        rol_id,
        direccion_cobro,
        ocupacion,
        activo,
        beneficiario,
        paciente_id,
      } = request.body()

      const hash = await bcrypt.hash(password, 10)
      const userid = await paciente.update(
        id,
        {
          direccion_cobro,
          ocupacion,
          activo,
          beneficiario,
          paciente_id,
        },
        {
          nombre,
          segundo_nombre,
          apellido,
          segundo_apellido,
          email,
          password: hash,
          direccion,
          numero_documento,
          fecha_nacimiento,
          numero_hijos,
          estrato,
          autorizacion_datos,
          habilitar,
          genero,
          estado_civil,
          tipo_documento,
          eps_id,
          rol_id,
        }
      )
      return response.status(200).json({ message: 'Actualizado', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  
  async readByUsuarioLogueado({ request, response }: HttpContext) {
    try {
      // 👇 Forzamos auth como any para evitar error TS
      const auth: any = (request as any).auth

      if (!auth) {
        return response.status(401).json({ message: 'No se encontró autenticación en el contexto' })
      }

      const user = await auth.use('api').authenticate()
      const usuarioId = user.id_usuario ?? user.id

      if (!usuarioId) {
        return response.status(400).json({ message: 'Usuario no encontrado en la sesión' })
      }

      const pacienteEncontrado = await paciente.readByUsuarioId(usuarioId)

      if (!pacienteEncontrado) {
        return response.status(404).json({ message: 'No existe paciente para este usuario' })
      }

      return response.status(200).json({
        message: 'Paciente obtenido',
        data: pacienteEncontrado,
      })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async readByUsuarioId({ params, response }: HttpContext) {
  try {
    const { usuario_id } = params
    const pacienteData = await paciente.readByUsuarioId(usuario_id)
    
    if (!pacienteData) {
      return response.status(404).json({ message: 'Paciente no encontrado' })
    }
    
    return response.status(200).json({ message: 'Paciente obtenido', data: pacienteData })
  } catch (e) {
    return response.status(500).json({ message: 'Error', error: e.message })
  }
}
}

