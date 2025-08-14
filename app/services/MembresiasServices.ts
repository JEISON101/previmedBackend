import Membresia from '#models/membresia'
import { MembresiaDTO } from '../interfaces/membresias.js'

export default class MembresiaService {
  async crear(datos: MembresiaDTO) {
    return await Membresia.create(datos)
  }

  async obtenerTodas() {
    return await Membresia.all()
  }

  async obtenerPorId(id: number) {
    return await Membresia.findOrFail(id)
  }

  async actualizar(id: number, datos: Partial<MembresiaDTO>) {
    const membresia = await Membresia.findOrFail(id)
    membresia.merge(datos)
    await membresia.save()
    return membresia
  }

  async eliminar(id: number) {
    const membresia = await Membresia.findOrFail(id)
    await membresia.delete()
    return 'Membresía eliminada correctamente'
  }
}