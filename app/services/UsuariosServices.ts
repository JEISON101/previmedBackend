import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '#models/usuario'

export default class UsuarioService {
  
  // Métodos CRUD (puedes implementarlos)
  async getAll() {
    return await Usuario.all()
  }

  async getById(id: number) {
    return await Usuario.findOrFail(id)
  }

 async doc(numero_documento: string) {
  return await Usuario
    .query()
    .where('numero_documento', numero_documento)
    .first() // devuelve el primero o null
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
      const hashedPassword = await bcrypt.hash(data.password, 10)
      data.password = hashedPassword
      const usuario = await Usuario.create(data)
      return usuario
    } catch (error) {
      console.error('Error al crear el usuario:', error)
      throw new Error('No se pudo crear el usuario')
    }
  }

  
}
