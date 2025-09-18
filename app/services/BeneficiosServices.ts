import Beneficio from "#models/beneficio"
import { DataBeneficio } from "../interfaces/beneficios.js"

export default class BeneficiosServices {
  async create(data: DataBeneficio) {
    return Beneficio.create(data)
  }

  async list() {
    return Beneficio.all()
  }

  async findById(id: number) {
    return Beneficio.findOrFail(id)
  }

  async update(id: number, data: Partial<DataBeneficio>) {
    const beneficio = await Beneficio.findOrFail(id)
    beneficio.merge(data)
    await beneficio.save()
    return beneficio
  }

  async delete(id: number) {
    const beneficio = await Beneficio.findOrFail(id)
    await beneficio.delete()
    return { message: 'Beneficio eliminado correctamente' }
  }
}
