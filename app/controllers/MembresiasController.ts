import MembresiaService from '#services/MembresiasServices'

const service = new MembresiaService()

export default class MembresiasController {
  async crear({ request, response }) {
    try {
      const datos = request.body()
      const nueva = await service.crear(datos)
      return response.created({ mensaje: 'Membresía creada', datos: nueva })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async listar({ response}) {
    try {
      const datos = await service.obtenerTodas()
      return response.ok(datos)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async obtenerPorId({ params, response }) {
    try {
      const datos = await service.obtenerPorId(params.id)
      return response.ok(datos)
    } catch (error) {
      return response.status(404).json({ error: 'Membresía no encontrada' })
    }
  }

  async actualizar({ params, request, response }) {
    try {
      const datos = request.body()
      const actualizada = await service.actualizar(params.id, datos)
      return response.ok({ mensaje: 'Membresía actualizada', datos: actualizada })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  async eliminar({ params, response }) {
    try {
      const mensaje = await service.eliminar(params.id)
      return response.ok({ mensaje })
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}