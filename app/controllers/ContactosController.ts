import ContactosServices from '#services/ContactosServices'
import { HttpContext } from '@adonisjs/core/http'

const newContactos = new ContactosServices()

export default class ContactosController {
  async create({ request, response }: HttpContext) {
    try {
      const { telefonouno, telefonodos, ubicacion, emailuno, emaildos } = request.body()

      await newContactos.create({ telefonouno, telefonodos, ubicacion, emailuno, emaildos })

      return response.status(201).json({ message: 'Exito' })
    } catch (e) {
      return response.status(500).json({ message: 'Error interno.', error: e.message })
    }
  }
  async read({ response }: HttpContext) {
    try {
      const contactos = await newContactos.read()

      return response.status(201).json({ message: 'Exito', data: contactos })
    } catch (e) {
      return response.status(500).json({ message: 'Error interno.' })
    }
  }
  async update({ params, request, response }: HttpContext) {
  try {
    const { id } = params

    // Obtenemos solo los campos permitidos
    const data = request.only([
      'telefonouno',
      'telefonodos',
      'ubicacion',
      'emailuno',
      'emaildos',
    ])

    // Filtramos valores null o undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null) // permite strings vacíos si los necesitas
    )

    await newContactos.update(cleanData, id)

    return response.status(200).json({ message: 'Exito' })
  } catch (e) {
    return response.status(500).json({ message: 'Error interno.', error: e.message })
  }
}

}
