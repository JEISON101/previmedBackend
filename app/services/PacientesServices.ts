import Paciente from '#models/paciente'
import db from '@adonisjs/lucid/services/db'
import { DataPaciente } from '../interfaces/pacientes.js'
import Usuario from '#models/usuario'
import { DataUsuario } from '../interfaces/usuarios.js'
import Membresia from '#models/membresia'
import MembresiaXPaciente from '#models/membresia_x_paciente'
import RegistrosPago from '#models/registros_pago'
import XLSX from 'xlsx'

export default class PacientesServices {
  /**
   * Crear un nuevo paciente + usuario
   */
  async create(data: DataPaciente, user: DataUsuario) {
    const trx = await db.transaction()
    try {
      await Usuario.create(user, { client: trx })
      const newUser = await Paciente.create(data, { client: trx })
      await trx.commit()
      return newUser
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al crear los dos registros: ${e.message}`)
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
      throw new Error(`Error al actualizar los registros: ${e.message}`)
    }
  }

  async readByUsuarioId(usuarioId: string) {
    return await Paciente.query().where('usuario_id', usuarioId).first()
  }

  async readBeneficiarios(pacienteId?: number) {
    const query = Paciente.query()
      .where('beneficiario', true)
      .preload('usuario')

    if (pacienteId) {
      query.where('paciente_id', pacienteId)
    } else {
      query.preload('paciente', (t) => t.preload('usuario'))
    }

    return await query
  }

  /**
   * ✅ Asociar beneficiario con titular
   * @param idBeneficiario - id_paciente del beneficiario
   * @param titularId - id_paciente del titular
   */
  async asociarBeneficiario(idBeneficiario: number, titularId: number) {
    const trx = await db.transaction()
    try {
      const beneficiario = await Paciente.findOrFail(idBeneficiario, { client: trx })
      beneficiario.useTransaction(trx)

      beneficiario.paciente_id = titularId
      beneficiario.beneficiario = true
      beneficiario.activo = true // ✅ activamos el beneficiario automáticamente

      await beneficiario.save()
      await trx.commit()
      return beneficiario
    } catch (e) {
      await trx.rollback()
      throw new Error(`Error al asociar beneficiario: ${e.message}`)
    }
  }

  async registroCompletoTitular(data: any) {
    const trx = await db.transaction()

    try {
      const { titular, beneficiarios = [], contrato, pago } = data

      // Crear titular
      const nuevoTitular = new Usuario()
      nuevoTitular.useTransaction(trx)
      Object.assign(nuevoTitular, titular.usuario)
      await nuevoTitular.save()

      // Crear paciente titular
      const nuevoPaciente = new Paciente()
      nuevoPaciente.useTransaction(trx)
      nuevoPaciente.usuario_id = nuevoTitular.id_usuario
      Object.assign(nuevoPaciente, titular.paciente)
      await nuevoPaciente.save()

      // Crear contrato
      const nuevoContrato = new Membresia()
      nuevoContrato.useTransaction(trx)
      Object.assign(nuevoContrato, contrato)
      await nuevoContrato.save()

      // Crear relación en tabla intermedia
      const pacienteContrato = new MembresiaXPaciente()
      pacienteContrato.useTransaction(trx)
      pacienteContrato.paciente_id = nuevoPaciente.id_paciente
      pacienteContrato.membresia_id = nuevoContrato.id_membresia
      await pacienteContrato.save()

      // Crear Pago
      const nuevoPago = new RegistrosPago()
      nuevoPago.useTransaction(trx)
      nuevoPago.membresia_id = nuevoContrato.id_membresia
      Object.assign(nuevoPago, pago)
      await nuevoPago.save()

      // Crear beneficiarios
    const beneficiariosCreados = []
    
    for (const beneficiario of beneficiarios) {
        // Crear Usuario Beneficiario
        const nuevoUsuarioBeneficiario = new Usuario()
        nuevoUsuarioBeneficiario.useTransaction(trx)
        Object.assign(nuevoUsuarioBeneficiario, beneficiario.usuario)
        await nuevoUsuarioBeneficiario.save()

        // Crear Paciente Beneficiario
        const nuevoPacienteBeneficiario = new Paciente()
        nuevoPacienteBeneficiario.useTransaction(trx)
        nuevoPacienteBeneficiario.usuario_id = nuevoUsuarioBeneficiario.id_usuario
        nuevoPacienteBeneficiario.paciente_id = nuevoPaciente.id_paciente
        Object.assign(nuevoPacienteBeneficiario, beneficiario.paciente)
        await nuevoPacienteBeneficiario.save()

        // Relacionar Beneficiario con Contrato
        const beneficiarioContrato = new MembresiaXPaciente()
        beneficiarioContrato.useTransaction(trx)
        beneficiarioContrato.paciente_id = nuevoPacienteBeneficiario.id_paciente
        beneficiarioContrato.membresia_id = nuevoContrato.id_membresia
        await beneficiarioContrato.save()

        beneficiariosCreados.push({
          usuario: nuevoUsuarioBeneficiario,
          paciente: nuevoPacienteBeneficiario
        })
      }

      await trx.commit()

      return {
          titular: {nuevoTitular, nuevoPaciente},
          contrato: nuevoContrato,
          pago: nuevoPago,
          beneficiarios: beneficiariosCreados
      }

    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getUsuariosId(id: string) {
    try {
      const pac = await Paciente.query().where('usuario_id', id).first()
      if (!pac) {
        return []
      }
      const pacientes = await Paciente.query().where('paciente_id', pac.paciente_id? pac.paciente_id : pac.id_paciente).orWhere('id_paciente', pac.paciente_id? pac.paciente_id : pac.id_paciente).preload('usuario')
      return pacientes
    } catch (error) {
      return []    }
  }

async exportExcel(filtro: string) {
    try {
      // Consultar pacientes con su última membresía
      const pacientes = await Paciente
        .query()
        .preload('usuario', (qu) => {
          qu.preload('eps')
        })
        .preload('membresiaPaciente', (qmp) => {
          qmp.preload('membresia', (qm) => qm.preload('plan'))
            .orderBy('id_membresia_x_paciente', 'desc')
        })

      // Filtrar por estado
      let filtrados = pacientes
      if (filtro === 'activa') {
        filtrados = pacientes.filter(p => 
          p.membresiaPaciente.length > 0 && 
          p.membresiaPaciente[0].membresia.estado === true
        )
      }
      if (filtro === 'inactiva') {
        filtrados = pacientes.filter(p => 
          p.membresiaPaciente.length > 0 && 
          p.membresiaPaciente[0].membresia.estado === false
        )
      }

      const cambiarFecha = (fecha: any) => {
        if (!fecha) return '';
        const d = new Date(fecha);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO');
      };
 
      // Convertir a objetos planos
      const datosExcel = filtrados.map(p => {
        const ultimaMembresia = p.membresiaPaciente[0]?.membresia || null
        return {
          'Nombre': p.usuario?.nombre || '',
          'Segundo Nombre': p.usuario?.segundo_nombre || '',
          'Apellido': p.usuario?.apellido || '',
          'Segundo Apellido': p.usuario?.segundo_apellido || '',
          'Número de Documento': p.usuario?.numero_documento || '',
          'Tipo de Documento': p.usuario?.tipo_documento || '',
          'Correo Electrónico': p.usuario?.email || '',
          'Dirección': p.usuario?.direccion || '',
          'Fecha de Nacimiento': cambiarFecha(p.usuario?.fecha_nacimiento) || '',
          'Estado Civil': p.usuario?.estado_civil || '',
          'Número de Hijos': p.usuario?.numero_hijos || '',
          'Estrato': p.usuario?.estrato || '',
          'Género': p.usuario?.genero || '',
          'EPS': p.usuario?.eps?.nombre_eps || '',
          'Habilitado': p.usuario?.habilitar ? 'Sí' : 'No',
          'Uso del Servicio': p.beneficiario? 'SI' : 'NO',
          'Ocupación': p.ocupacion || '',
          'Cargo': p.paciente_id != null? 'BENEFICIARIO' : 'TITULAR',
          'Numero de Contrato': ultimaMembresia?.numero_contrato || '',
          'Contrato Inicio': cambiarFecha(ultimaMembresia?.fecha_inicio) || '',
          'Contrato Fin': cambiarFecha(ultimaMembresia?.fecha_fin) || '',
          'Forma de Pago del Contrato': ultimaMembresia?.forma_pago || '',
          'Plan': ultimaMembresia?.plan?.tipo_plan || '',
          'Estado': ultimaMembresia?.estado ? 'Activo' : 'Inactivo',
        }
      })

      // Crear workbook y convertir a CSV
      const workbook = XLSX.utils.book_new()
      const hoja = XLSX.utils.json_to_sheet(datosExcel)
      XLSX.utils.book_append_sheet(workbook, hoja, 'Pacientes')

      // Exportar como CSV 
      const csv = XLSX.utils.sheet_to_csv(hoja)
      
      // Agregar BOM para que Excel reconozca UTF-8 correctamente
      const buffer = Buffer.from('\uFEFF' + csv, 'utf-8')
      return buffer
      
    } catch (error) {
      throw error
    }
  }

  async desvincular(idPaciente: number){
    const nuevo = await Paciente.find(idPaciente);
    if(!nuevo) return null;
    nuevo.paciente_id = null;
    await nuevo.save()
  }
}