import Membresia from '#models/membresia'
import MembresiaXPaciente from '#models/membresia_x_paciente'

export default class MembresiasService {
  // Listar todas las membresías con relaciones
async listar() {
    return await Membresia.query()
      .preload('membresiaPaciente', (mpQuery) => {
        mpQuery.preload('paciente', (pQuery) => {
          pQuery.preload('usuario') // Trae el nombre y número de documento
        })
      })
  }



  async obtenerPorId(id: number) {
    const membresia = await Membresia.query()
      .where('id_membresia', id)
      .preload('plan')
      .preload('membresiaPaciente', (mp) => {
        mp.preload('paciente', (p) => {
          p.preload('usuario', (u) => {
            u.select('id_usuario', 'nombre', 'numero_documento')
          })
        })
      })
      .preload('registrosPagos')
      .first()

    if (!membresia) throw new Error('Membresía no encontrada')
    return membresia
  }

  // Crear membresía (opcionalmente asociar paciente)
async crear(data: Partial<Membresia>, paciente_id?: number) {
  const nueva = await Membresia.create(data)

  if (paciente_id) { // ✅ Esta condición debe ser verdadera para crear la relación
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
