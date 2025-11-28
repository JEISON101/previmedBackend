import Membresia from '#models/membresia'
import MembresiaXPaciente from '#models/membresia_x_paciente'
import { DateTime } from 'luxon'
import PacientesServices from './PacientesServices.js'
import RegistrosPagoService from './RegistrosPagosServices.js'
import MembresiaXPacienteService from './MembresiaXPacientesServices.js'

export default class MembresiasService {
  // Listar todas las membresías con preload profundo
  async listar() {
    return await Membresia.query()
      .preload('membresiaPaciente', (mpQuery) => {
        mpQuery.preload('paciente', (pQuery) => {
          pQuery.preload('usuario') //  Aquí se trae nombre y documento
        })
      })
  }

  // Obtener membresía por ID con preload completo
  async obtenerPorId(id: number) {
    const membresia = await Membresia.query()
      .where('id_membresia', id)
      .preload('plan')
      .preload('membresiaPaciente', (mp) => {
        mp.preload('paciente', (p) => {
          p.preload('usuario')
        })
      })
      .preload('registrosPagos')
      .first()

    if (!membresia) throw new Error('Membresía no encontrada')
    return membresia
  }

  // Crear membresía y asociar paciente si se envía
  // MembresiasService.ts
async crear(data: Partial<Membresia>, paciente_id?: number) {
  // 1️⃣ Crear la membresía
  const nueva = await Membresia.create(data)

  // 2️⃣ Asociar paciente si viene paciente_id
  if (paciente_id) {
    await MembresiaXPaciente.create({
      paciente_id,
      membresia_id: nueva.id_membresia
    })
    return nueva;
  }

  // 3️⃣ Cargar relación membresiaPaciente antes de devolver
  const membresiaCompleta = await Membresia.query()
    .where('id_membresia', nueva.id_membresia)
    .preload('membresiaPaciente', (mpQuery) => {
      mpQuery.preload('paciente', (pQuery) => {
        pQuery.preload('usuario') // si quieres info del usuario
      })
    })
    .firstOrFail()

  return membresiaCompleta
}



  // Actualizar membresía
  async actualizar(id: number, data: Partial<Membresia>) {
    const membresia = await Membresia.find(id)
    if (!membresia) throw new Error('Membresía no encontrada')

    membresia.merge(data)
    await membresia.save()
    return await this.obtenerPorId(id)
  }

  // Eliminar membresía
  async eliminar(id: number) {
    const membresia = await Membresia.find(id)
    if (!membresia) throw new Error('Membresía no encontrada')

    await membresia.delete()
    return 'Membresía eliminada correctamente'
  }

async buscarActivaPorDocumento(numero_documento: string) {
  const hoy = DateTime.now().toISODate() // solo fecha, sin hora

  // consulta la membrecia para saber si esta actvia tambien con la fecha
  const membresias = await Membresia.query()
    .where('estado', true)
    .whereRaw('DATE(fecha_inicio) <= ?', [hoy])
    .whereRaw('DATE(fecha_fin) >= ?', [hoy])
    .preload('membresiaPaciente', (mp) => {
      mp.preload('paciente', (p) => {
        p.preload('usuario')
      })
    })

  // aqui filtro
  const match = membresias.find((m) =>
    m.membresiaPaciente.some(
      (rel) =>
        rel.paciente &&
        rel.paciente.usuario &&
        rel.paciente.usuario.numero_documento === numero_documento
    )
  )

  if (!match) {
    return {
      ok: false,
      mensaje: 'No hay membresía activa asociada a ese número de documento.',
    }
  }

  const relacion = match.membresiaPaciente.find(
    (rel) =>
      rel.paciente &&
      rel.paciente.usuario &&
      rel.paciente.usuario.numero_documento === numero_documento
  )!

  const paciente = relacion.paciente
  const usuario = paciente.usuario

  return {
    ok: true,
    membresia: {
      id_membresia: match.id_membresia,
      numero_contrato: match.numero_contrato,
      fecha_inicio: match.fecha_inicio,
      fecha_fin: match.fecha_fin,
      plan_id: match.plan_id,
      estado: match.estado,
    },
    paciente: {
      id_paciente: paciente.id_paciente,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      numero_documento: usuario.numero_documento,
      usuario_id: usuario.id_usuario,
    },
  }
}

  async renovarContrato(data: any) {
    const { pago, contrato, personasAsignadas, titularId } = data;

    const pacienteService = new PacientesServices();
    const pagoService = new RegistrosPagoService();
    const contXpaci = new MembresiaXPacienteService();

    try {
      const titular = await pacienteService.readById(titularId);
      if (!titular?.usuario_id) {
        throw new Error('Usuario ID del titular no encontrado');
      }

      await pacienteService.desvincular(titularId);

      const nuevoContrato = await this.crear({
        ...contrato,
        firma: `${titular.usuario.nombre} ${titular.usuario.apellido}`
      });

      await pagoService.create_pago({
        ...pago,
        membresia_id: nuevoContrato.id_membresia,
        fecha_pago: new Date(),
        estado: 'Realizado'
      });

      // Obtener círculo de personas del anterior contrato
      const circuloPersonas = await pacienteService.getUsuariosId(titular.usuario_id);

      // Desvincular pacientes que no están en el nuevo contrato
      const pacientesDesvincular = circuloPersonas.filter((v: any) =>
        !personasAsignadas.some((n: any) => n.idPaciente === v.idPaciente)
      );

      if (pacientesDesvincular.length > 0) {
        for (const p of pacientesDesvincular) {
          await pacienteService.desvincular(p.id_paciente);
        }
      }

      for (const p of personasAsignadas) {
        if (p.idPaciente !== titularId) {
          await pacienteService.asociarBeneficiario(p.idPaciente, titularId);
        }
        await contXpaci.create({
          paciente_id: p.idPaciente,
          membresia_id: nuevoContrato.id_membresia
        });
      }

      return {
        contrato: nuevoContrato,
        personasAsociadas: personasAsignadas.length
      };

    } catch (error) {
      throw error.message;
    }
  }

}