import MembresiaXPaciente from "#models/membresia_x_paciente"
import Paciente from "#models/paciente"
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

  async getByUserId(id: string){
    const paciente = await Paciente.query().where('usuario_id', id).preload('usuario').first();
    const res = await MembresiaXPaciente.query()
    .where('paciente_id', paciente?.id_paciente??'')
    .preload('membresia', (queryMembresia)=>{queryMembresia.preload('plan')})
    .orderBy('id_membresia_x_paciente', 'desc')
    .first()
    return res
  }
}
