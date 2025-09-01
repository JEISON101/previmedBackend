import Membresia from '#models/membresia'
import MembresiaXPaciente from '#models/membresia_x_paciente'

export default class MembresiasService {
  // Listar todas las membresías con preload profundo
  async listar() {
    return await Membresia.query()
      .preload('membresiaPaciente', (mpQuery) => {
        mpQuery.preload('paciente', (pQuery) => {
          pQuery.preload('usuario') //  Aquí se trae nombre y documento
        })
      })
  }

  // Obtener membresía por ID con preload completo
  async obtenerPorId(id: number) {
    const membresia = await Membresia.query()
      .where('id_membresia', id)
      .preload('plan')
      .preload('membresiaPaciente', (mp) => {
        mp.preload('paciente', (p) => {
          p.preload('usuario')
        })
      })
      .preload('registrosPagos')
      .first()

    if (!membresia) throw new Error('Membresía no encontrada')
    return membresia
  }

  // Crear membresía y asociar paciente si se envía
  async crear(data: Partial<Membresia>, paciente_id?: number) {
    const nueva = await Membresia.create(data)

    if (paciente_id) {
      await MembresiaXPaciente.create({
        paciente_id,
        membresia_id: nueva.id_membresia
      })
    }

    return await this.obtenerPorId(nueva.id_membresia)
  }

  // Actualizar membresía
  async actualizar(id: number, data: Partial<Membresia>) {
    const membresia = await Membresia.find(id)
    if (!membresia) throw new Error('Membresía no encontrada')

    membresia.merge(data)
    await membresia.save()
    return await this.obtenerPorId(id)
  }

  // Eliminar membresía
  async eliminar(id: number) {
    const membresia = await Membresia.find(id)
    if (!membresia) throw new Error('Membresía no encontrada')

    await membresia.delete()
    return 'Membresía eliminada correctamente'
  }
}