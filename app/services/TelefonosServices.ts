import Usuario from '#models/usuario'
import Telefono from '#models/telefono'
import type { CrearTelefonoDto, UpdateTelefonoDto } from '../interfaces/telefonos.js'

export default class TelefonoService {
  // Crear teléfono (verifica que el usuario exista)
  async create(data: CrearTelefonoDto): Promise<Telefono> {
    await Usuario.findOrFail(data.usuario_id)
    const tel = await Telefono.create({
      telefono: data.telefono,
      usuario_id: data.usuario_id,
    })
    return tel
  }

  // Listar todos
  async findAll(): Promise<Telefono[]> {
    return Telefono.query().preload('usuario')
  }

  // Buscar por ID de telefono
  async findById(id: number): Promise<Telefono> {
    return Telefono.query().where('id_telefono', id).preload('usuario').firstOrFail()
  }

  // Listar por id de usuario
  async findByUsuario(usuario_id: string): Promise<Telefono[]> {
    return Telefono.query().where('usuario_id', usuario_id).preload('usuario')
  }

  // Actualizar
  async update(data: UpdateTelefonoDto): Promise<Telefono> {
    const tel = await Telefono.query()
      .where('id_telefono', data.id_telefono)
      .firstOrFail()

    if (data.telefono !== undefined) tel.telefono = data.telefono
    if (data.usuario_id !== undefined) {
      await Usuario.findOrFail(data.usuario_id)
      tel.usuario_id = data.usuario_id
    }

    await tel.save()
    await tel.load('usuario')
    return tel
  }

  // Eliminar
  async remove(id: number): Promise<void> {
    const tel = await Telefono.query().where('id_telefono', id).firstOrFail()
    await tel.delete()
  }
}
