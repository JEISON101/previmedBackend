import Paciente from '#models/paciente'
import Usuario from '#models/usuario'
import db from '@adonisjs/lucid/services/db'
import { DataPaciente } from '../interfaces/pacientes.js'
import { DataUsuario } from '../interfaces/usuarios.js'


type DataPacienteCompat = Omit<DataPaciente, 'paciente_id'> & {
  paciente_id?: number | null
}

export default class PacientesServices {
  //CREATE 
  // Acepta DataPaciente normal o con paciente_id null (compat)
  async create(data: DataPacienteCompat, user: DataUsuario) {
    const trx = await db.transaction()
    try {
      const u = await Usuario.create(user as any, { client: trx })

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

  //READS
  async read() {
    return await Paciente.query().preload('usuario')
  }

  async readByTitular() {
    // Titulares = pacientes sin paciente_id (no dependientes)
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

  //UPDATE SOLO PACIENTES 
  // Patch compatible que permite paciente_id: null SIN cambiar DataPaciente
  async updatePacienteCampos(
    id: number,
    patch: Partial<DataPacienteCompat>
  ) {
    const pac: any = await Paciente.findOrFail(id)
    pac.merge(patch as any)
    await pac.save()
    return pac
  }

  //DELETE 
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

  //BENEFICIARIOS: LISTAS/DETALLES 
  async readBeneficiarios() {
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

  //BENEFICIARIOS: ASOCIAR / DESVINCULAR 
  async asociarBeneficiario(beneficiarioId: number, titularId: number) {
    const beneficiario: any = await Paciente.findOrFail(beneficiarioId)
    const titular: any = await Paciente.findOrFail(titularId)

    if (beneficiarioId === titularId) {
      throw new Error('paciente_id no puede ser el mismo paciente')
    }
    if (titular.beneficiario) {
      throw new Error('El paciente indicado como titular es beneficiario; no puede ser titular')
    }

    beneficiario.merge({
      beneficiario: true,
      paciente_id: titular.id_paciente ?? titular.id,
      activo: true,
    })
    await beneficiario.save()

    return beneficiario
  }

  async desvincularBeneficiario(beneficiarioId: number, desactivar = true) {
    const beneficiario: any = await Paciente.findOrFail(beneficiarioId)
    beneficiario.merge({
      paciente_id: null,
      beneficiario: false,
      activo: desactivar ? false : beneficiario.activo,
    })
    await beneficiario.save()
    return beneficiario
  }

  async usuarioDeBeneficiario(beneficiarioId: number) {
    const b: any = await Paciente.query()
      .where('id_paciente', beneficiarioId)
      .preload('usuario')
      .firstOrFail()

    return {
      usuario_id: b.usuario?.id_usuario ?? b.usuario?.id,
      usuario: b.usuario,
    }
  }
}
