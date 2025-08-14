import UsuarioServices from '../services/UsuariosServices.js'
import type { HttpContext } from '@adonisjs/http-server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const usuarioServices = new UsuarioServices()

export default class UsuariosController {
  
  // Login
 public async login({ request, response }) {
  try {
    const { numero_documento, password } = request.body()

    // Validar datos obligatorios
    if (!numero_documento || !password) {
      return response.status(400).json({
        msg: 'El número de documento y la contraseña son obligatorios'
      })
    }

    // Buscar usuario por numero_documento (ya modificado en el service)
    const usuario = await usuarioServices.doc(numero_documento)

    if (!usuario) {
      return response.status(404).json({ msg: 'Usuario no encontrado' })
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password)
    if (!validPassword) {
      return response.status(401).json({ msg: 'Contraseña incorrecta' })
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, numero_documento: usuario.numero_documento },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: '1h' }
    )

    return response.status(200).json({
      msg: 'Login exitoso',
      usuario,
      token
    })

  } catch (error) {
    return response.status(500).json({
      msg: 'Error interno en el login',
      error: error.message
    })
  }
}


  // CRUD
  public async index({ response }: HttpContext) {
    try {
      const usuarios = await usuarioServices.getAll()
      return response.ok(usuarios)
    } catch (error) {
      return response.status(500).json({
        msj: "No se pudo obtener usuarios",
        error
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    const usuario = await usuarioServices.getById(params.id)
    return response.ok(usuario)
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.body()

      if (!data.numero_documento) {
        return response.status(400).json({ msg: 'El documento es obligatorio' })
      }
      if (!data.password) {
        return response.status(400).json({ msg: 'La contraseña es obligatoria.' })
      }

      const usuario = await usuarioServices.create(data)
      return response.status(201).json({ msg: 'Usuario creado', data: usuario })
    } catch (e) {
      return response.status(500).json({ msg: 'Error interno.', error: e.message })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.body()
    const usuario = await usuarioServices.update(params.id, data)
    return response.ok(usuario)
  }

  public async destroy({ params, response }: HttpContext) {
    const result = await usuarioServices.delete(params.id)
    return response.ok(result)
  }
}
