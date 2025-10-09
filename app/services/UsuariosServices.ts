import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid' 
import Usuario from '#models/usuario'

export default class UsuarioService {
  
  // Métodos CRUD 
  async getAll() {
    return await Usuario.query().preload('rol').preload('eps')
  }

  async getById(id: number) {
    return await Usuario.findOrFail(id)
  }

  async doc(numero_documento: string) {
    return await Usuario
      .query()
      .where('numero_documento', numero_documento)
      .preload('rol')
      .first() 
  }

  async update(id: number, data: any) {
    const usuario = await Usuario.findOrFail(id)
    usuario.merge(data)
    await usuario.save()
    return usuario
  }

  async delete(id: number) {
    const usuario = await Usuario.findOrFail(id)
    await usuario.delete()
    return { msg: 'Usuario eliminado' }
  }

  // Crear usuario
  public async create(data: any) {
    try {
      // Generar UUID (tu tabla debe tener id_usuario como PK o UUID)
      data.id_usuario = uuidv4()   

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(data.password, 10)
      data.password = hashedPassword

      // Crear usuario en DB
      const usuario = await Usuario.create(data)
      return usuario
    } catch (error) {
      console.error('Error al crear el usuario:', error)
      throw new Error('No se pudo crear el usuario')
    }
  }
}
