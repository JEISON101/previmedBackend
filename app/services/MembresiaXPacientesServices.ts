import MembresiaXPaciente from "#models/membresia_x_paciente"
import { DataMembresiaXPaciente } from "../interfaces/membresia_x_paciente.js"

export default class MembresiaXPacienteService {
  async create(data: DataMembresiaXPaciente) {
    return MembresiaXPaciente.create(data)
  }

  async list() {
    return MembresiaXPaciente.all()
  }

  async findById(id: number) {
    return MembresiaXPaciente.findOrFail(id)
  }

  async update(id: number, data: Partial<DataMembresiaXPaciente>) {
    const registro = await MembresiaXPaciente.findOrFail(id)
    registro.merge(data)
    await registro.save()
    return registro
  }

  async delete(id: number) {
    const registro = await MembresiaXPaciente.findOrFail(id)
    await registro.delete()
    return { message: 'MembresiaXPaciente eliminado correctamente' }
  }
}
