import Paciente from '#models/paciente'
import db from '@adonisjs/lucid/services/db'
import { DataPaciente } from '../interfaces/pacientes.js'
import Usuario from '#models/usuario'
import { DataUsuario } from '../interfaces/usuarios.js'

export default class PacientesServices {
  async create(data: DataPaciente, user: DataUsuario) {
    const trx = await db.transaction()
    try {
      await Usuario.create(user, { client: trx })
      const newUser = await Paciente.create(data, { client: trx })
      await trx.commit()
      return newUser
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al crear las dos registros ${e.message}`)
    }
  }
  async read() {
    return await Paciente.query().preload('usuario')
  }
  async readByTitular() {
    return await Paciente.query().preload('usuario').whereNull('paciente_id').has('membresiaPaciente').preload('membresiaPaciente', (mxpQuery)=>{mxpQuery.preload('membresia')})
  }
  async readByDoc(doc: string) {
    const pac = await Usuario.query().where('numero_documento', doc).first()
    return pac
  }
  async readById(id: number) {
    const pac = await Paciente.query().preload('usuario').where('id_paciente', id).first()
    return pac
  }
  async delete(id: number) {
    const trx = await db.transaction()
    try {
      const pac = await Paciente.findOrFail(id, { client: trx })
      const iduser = pac.usuario_id
      const user = await Usuario.findOrFail(iduser, { client: trx })
      await pac.useTransaction(trx).delete()
      await user.useTransaction(trx).delete()

      await trx.commit()
      return { pac, user }
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al eliminar los registros ${e.message}`)
    }
  }
  async update(id: number, data: DataPaciente, userD: DataUsuario) {
    const trx = await db.transaction()
    try {
      const pac = await Paciente.findOrFail(id, { client: trx })
      const iduser = pac.usuario_id
      const user = await Usuario.findOrFail(iduser, { client: trx })
      pac.useTransaction(trx).merge(data)
      await pac.save()
      user.useTransaction(trx).merge(userD)
      await user.save()
      await trx.commit()
      return { pac, user }
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al eliminar los registros ${e.message}`)
    }
  }
    async readByUsuarioId(usuarioId: string) {
    return await Paciente.query().where('usuario_id', usuarioId).first()
  
  }
   async readBeneficiarios() {
  try {
    const beneficiarios = await Paciente.query()
      .where('beneficiario', true)
      .preload('usuario')
      .preload('paciente', (titularQuery) => {
        titularQuery.preload('usuario')
      })

    return beneficiarios
  } catch (error) {
    throw new Error(`Error al obtener beneficiarios: ${error.message}`)
  }
}

}

