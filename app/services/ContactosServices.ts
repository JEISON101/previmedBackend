import Contacto from '#models/contacto'
import { DataContactos } from '../interfaces/contactos.interface.js'

export default class ContactosServices {
  async create(data: DataContactos) {
    return await Contacto.create(data)
  }
  async read() {
    return await Contacto.all()
  }
  async update(data: any, id: any) {
    const row = await Contacto.findOrFail(id)
    row.merge(data)
    return await row.save()
  }
}
