import ContactosEmergencia from "#models/contactos_emergencia"
import { DataContactoEmergencia } from "../interfaces/contactos_emergencias.js"

export default class ContactosEmergenciaService {
  async create(data: DataContactoEmergencia) {
    return ContactosEmergencia.create(data)
  }

  async list() {
    return ContactosEmergencia.all()
  }

  async findById(id: number) {
    return ContactosEmergencia.findOrFail(id)
  }

  async update(id: number, data: Partial<DataContactoEmergencia>) {
    const contacto = await ContactosEmergencia.findOrFail(id)
    contacto.merge(data)
    await contacto.save()
    return contacto
  }

  async delete(id: number) {
    const contacto = await ContactosEmergencia.findOrFail(id)
    await contacto.delete()
    return { message: 'Contacto emergencia eliminado correctamente' }
  }
}
