import UsuarioServices from '../services/UsuariosServices.js'
import type { HttpContext } from '@adonisjs/http-server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '#start/env'

const usuarioServices = new UsuarioServices()

export default class UsuariosController {
  // Login
  public async login({ request, response }: HttpContext) {
    try {
      const { numero_documento, password } = request.body()

      if (!numero_documento || !password) {
        return response.status(400).json({
          msg: 'El número de documento y la contraseña son obligatorios',
        })
      }

      const usuario = await usuarioServices.doc(numero_documento)
      if (!usuario) {
        return response.status(200).json({ msg: 'Usuario no encontrado' })
      }

      const validPassword = await bcrypt.compare(password, usuario.password)
      if (!validPassword) {
        return response.status(200).json({ msg: 'Contraseña incorrecta' })
      }

      const token = jwt.sign(
        { id: usuario.id_usuario, numero_documento: usuario.numero_documento },
        env.get("APP_KEY"),
        { expiresIn: '1h' }
      )

      response.cookie('auth', token, {
        httpOnly: false,
        sameSite: false,
        secure: false,
        maxAge: 1000 * 60 * 60,
      })

      return response.status(200).json({ message: 'Acceso permitido', data:{id: usuario.id_usuario, documento: usuario.numero_documento}, jwt:token })
    } catch (error) {
      return response.status(500).json({
        msg: 'Error interno en el login',
        error: error.message,
      })
    }
  }

  // Listar todos
  public async index({ response }: HttpContext) {
    try {
      const usuarios = await usuarioServices.getAll()
      return response.ok(usuarios)
    } catch (error) {
      return response.status(500).json({
        msg: 'No se pudo obtener usuarios',
        error,
      })
    }
  }

  // Mostrar uno
  public async show({ params, response }: HttpContext) {
    const usuario = await usuarioServices.getById(params.id)
    return response.ok(usuario)
  }

  // Crear
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.body()

      if (!data.numero_documento) {
        return response.status(400).json({ msg: 'El documento es obligatorio' })
      }
      if (!data.password) {
        return response.status(400).json({ msg: 'La contraseña es obligatoria' })
      }

      const usuario = await usuarioServices.create(data)
      return response.status(201).json({ msg: 'Usuario creado', data: usuario })
    } catch (e) {
      return response.status(500).json({ msg: 'Error interno.', error: e.message })
    }
  }

  // Actualizar
  public async update({ params, request, response }: HttpContext) {
    const data = request.body()
    const usuario = await usuarioServices.update(params.id, data)
    return response.ok(usuario)
  }

  // Eliminar
  public async destroy({ params, response }: HttpContext) {
    const result = await usuarioServices.delete(params.id)
    return response.ok(result)
  }
}
