import Paciente from '#models/paciente'
import Usuario from '#models/usuario'
import db from '@adonisjs/lucid/services/db'
import { DataPaciente } from '../interfaces/pacientes.js'
import { DataUsuario } from '../interfaces/usuarios.js'

export default class PacientesServices {
  async create(data: DataPaciente, user: DataUsuario) {
    const trx = await db.transaction()
    try {
      // 1) Crear usuario
      const u = await Usuario.create(user as any, { client: trx })

      // 2) Crear paciente 
      const payload: any = {
        ...data,
        usuario_id: (data as any).usuario_id ?? (u as any).id_usuario ?? (u as any).id,
      }

      const newPac = await Paciente.create(payload, { client: trx })
      await trx.commit()
      return newPac
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  /* ========== READS ========== */
  async read() {
    return await Paciente.query().preload('usuario')
  }

  async readByTitular() {
    // Titulares: pacientes sin paciente_id (no dependientes)
    return await Paciente.query().whereNull('paciente_id').preload('usuario')
  }

  async readByDoc(doc: string) {
    return await Usuario.query().where('numero_documento', doc).first()
  }

  async readById(id: number) {
    return await Paciente.query().where('id_paciente', id).preload('usuario').first()
  }

  async readByUsuarioId(usuarioId: string) {
    return await Paciente.query().where('usuario_id', usuarioId).first()
  }

  /* ========== UPDATE ========== */
  async update(id: number, data: DataPaciente, userD: DataUsuario) {
    const trx = await db.transaction()
    try {
      const pac: any = await Paciente.findOrFail(id, { client: trx })
      const user = await Usuario.findOrFail(pac.usuario_id, { client: trx })

      // Actualiza paciente solo con los campos que vengan
      pac.useTransaction(trx).merge(data as any)
      await pac.save()

      // Actualiza usuario solo con los campos que vengan
      // (Si vas a actualizar password, mándala ya hasheada desde el controller)
      user.useTransaction(trx).merge(userD as any)
      await user.save()

      await trx.commit()
      return { pac, user }
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  /* ========== DELETE ========== */
  async delete(id: number) {
    const trx = await db.transaction()
    try {
      const pac: any = await Paciente.findOrFail(id, { client: trx })
      const user = await Usuario.findOrFail(pac.usuario_id, { client: trx })

      await pac.useTransaction(trx).delete()
      await user.useTransaction(trx).delete()

      await trx.commit()
      return { pac, user }
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  /* ========== BENEFICIARIOS ========== */
  async readBeneficiarios() {
    // Beneficiarios = pacientes con beneficiario=true
    const beneficiarios = await Paciente.query()
      .where('beneficiario', true)
      .preload('usuario')

    const titularesIds = beneficiarios
      .map((b: any) => b.paciente_id)
      .filter((id: any) => !!id)

    const titulares = titularesIds.length
      ? await Paciente.query().whereIn('id_paciente', titularesIds).preload('usuario')
      : []

    const titularesMap = new Map(titulares.map((t: any) => [t.id_paciente, t.usuario]))

    return beneficiarios.map((b: any) => ({
      id: b.id_paciente,
      nombre: b.usuario?.nombre ?? '',
      apellido: b.usuario?.apellido ?? '',
      documento: b.usuario?.numero_documento ?? '',
      email: b.usuario?.email ?? '',
      titular: titularesMap.has(b.paciente_id)
        ? `${titularesMap.get(b.paciente_id)?.nombre} ${titularesMap.get(b.paciente_id)?.apellido}`
        : 'Sin titular',
    }))
  }

  async readBeneficiarioById(id: number) {
    const b: any = await Paciente.query()
      .where('id_paciente', id)
      .where('beneficiario', true)
      .preload('usuario')
      .first()

    if (!b) return null

    let titularNombre = 'Sin titular'
    if (b.paciente_id) {
      const t: any = await Paciente.query()
        .where('id_paciente', b.paciente_id)
        .preload('usuario')
        .first()
      if (t?.usuario) titularNombre = `${t.usuario.nombre} ${t.usuario.apellido}`
    }

    return {
      id: b.id_paciente,
      nombre: b.usuario?.nombre ?? '',
      apellido: b.usuario?.apellido ?? '',
      documento: b.usuario?.numero_documento ?? '',
      email: b.usuario?.email ?? '',
      genero: b.usuario?.genero ?? '',
      direccion: b.usuario?.direccion ?? '',
      paciente_id: b.paciente_id,
      titular: titularNombre,
    }
  }
}
