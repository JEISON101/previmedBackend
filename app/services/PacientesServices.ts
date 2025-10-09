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
      throw new Error(`Error al crear los dos registros ${e.message}`)
    }
  }

  async read() {
    return await Paciente.query().preload('usuario')
  }

  async readByTitular() {
    return await Paciente.query()
      .preload('usuario')
      .whereNull('paciente_id')
      .has('membresiaPaciente')
      .preload('membresiaPaciente', (mxpQuery) => {
        mxpQuery.preload('membresia')
      })
  }

  async readByDoc(doc: string) {
    const pac = await Usuario.query().where('numero_documento', doc).first()
    return pac
  }

  async readById(id: number) {
    const pac = await Paciente.query()
      .preload('usuario')
      .where('id_paciente', id)
      .first()
    return pac
  }

  async delete(id: number) {
    const trx = await db.transaction()
    try {
      const pac = await Paciente.findOrFail(id, { client: trx })
      const user = await Usuario.findOrFail(pac.usuario_id, { client: trx })

      await pac.useTransaction(trx).delete()
      await user.useTransaction(trx).delete()

      await trx.commit()
      return { pac, user }
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al eliminar los registros: ${e.message}`)
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

      const titularesIds = beneficiarios
        .map((b) => b.paciente_id)
        .filter((id) => !!id)

      const titulares = await Paciente.query()
        .whereIn('id_paciente', titularesIds)
        .preload('usuario')

      const titularesMap = new Map(
        titulares.map((t) => [t.id_paciente, t.usuario])
      )
      const result = beneficiarios.map((b) => ({
        id: b.id_paciente,
        nombre: b.usuario?.nombre ?? '',
        apellido: b.usuario?.apellido ?? '',
        documento: b.usuario?.numero_documento ?? '',
        email: b.usuario?.email ?? '',
        titular: titularesMap.has(b.paciente_id)
          ? `${titularesMap.get(b.paciente_id)?.nombre} ${titularesMap.get(b.paciente_id)?.apellido}`
          : 'Sin titular',
      }))

      return result
    } catch (error) {
      console.log('🟥 ERROR DETALLADO EN readBeneficiarios')
  }
}


// 🟢 Leer beneficiario por ID (con su titular asociado)
async readBeneficiarioById(id: number) {
  try {
    const beneficiario = await Paciente.query()
      .where('id_paciente', id)
      .where('beneficiario', true)
      .preload('usuario')
      .first()

    if (!beneficiario) return null

    // Buscar titular asociado
    let titularNombre = 'Sin titular'
    if (beneficiario.paciente_id) {
      const titular = await Paciente.query()
        .where('id_paciente', beneficiario.paciente_id)
        .preload('usuario')
        .first()

      if (titular && titular.usuario) {
        titularNombre = `${titular.usuario.nombre} ${titular.usuario.apellido}`
      }
    }

    return {
      id: beneficiario.id_paciente,
      nombre: beneficiario.usuario?.nombre ?? '',
      apellido: beneficiario.usuario?.apellido ?? '',
      documento: beneficiario.usuario?.numero_documento ?? '',
      email: beneficiario.usuario?.email ?? '',
      genero: beneficiario.usuario?.genero ?? '',
      direccion: beneficiario.usuario?.direccion ?? '',
      paciente_id: beneficiario.paciente_id,
      titular: titularNombre,
    }
  } catch (error) {
    console.error('🟥 ERROR en readBeneficiarioById:', error)
    throw new Error('Error al obtener el beneficiario por ID')
  }
}
}
