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
}
