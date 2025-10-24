import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import VisitasServices from '#services/VisitasServices'
import mail from '@adonisjs/mail/services/main'
import Paciente from '#models/paciente'
import Medico from '#models/medico'
import { emailVisitaMedico } from '../templates/emailVisitaMedico.js'
import { emailVisitaPaciente } from '../templates/emailVisitaPaciente.js'
import Barrio from '#models/barrio'

const visitasService = new VisitasServices()

export default class VisitasController {
  async crearVisita({ request, response }: HttpContext) {
    try {
      const {
        fecha_visita,
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      } = request.body()

      const nueva = await visitasService.crear({
        fecha_visita: DateTime.fromISO(fecha_visita), 
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      })

      const paciente = await Paciente.query().where('id_paciente', paciente_id).preload('usuario').first()
      const medico = await Medico.query().where('id_medico', medico_id).preload('usuario').first()
      const emailLimpioPaciente = paciente?.usuario.email.trim();
      const emailLimipioMedico = medico?.usuario.email.trim();
      const barrio = await Barrio.query().where('id_barrio', barrio_id).first();
      // Formatear fecha y hora
      const fechaVisita = DateTime.fromISO(fecha_visita)
      const fechaFormateada = fechaVisita.setLocale('es').toFormat('dd \'de\' MMMM \'de\' yyyy')
      const horaFormateada = fechaVisita.toFormat('HH:mm')

      if (nueva) {
        // Email para el paciente
        await mail.send((message) => {
          message
            .from(process.env.MAIL_FROM_ADDRESS || 'proyectoprevimed@gmail.com', 'PREVIMED S.A.S')
            .to(emailLimpioPaciente!)
            .subject(`Confirmación de visita médica - ${fechaFormateada}`)
            .html(emailVisitaPaciente({
              nombrePaciente: `${paciente?.usuario.nombre} ${paciente?.usuario.apellido}`,
              nombreMedico: `${medico?.usuario.nombre} ${medico?.usuario.apellido}`,
              especialidadMedico: 'Medicina General',
              fechaVisita: fechaFormateada,
              horaVisita: horaFormateada,
              descripcion: descripcion,
              nombreClinica: 'PREVIMED S.A.S',
              direccionPrevimed: 'Cra 9 # 9n-19, Popayán, Colombia',
              direccionVisita:direccion,
              barrio: barrio?.nombre_barrio!,
              telefonoPrevimed: '310 6236219'
            }))
        })

        // Email para el médico
        await mail.send((message) => {
          message
            .from(process.env.MAIL_FROM_ADDRESS || 'proyectoprevimed@gmail.com', 'PREVIMED S.A.S')
            .to(emailLimipioMedico!)
            .subject(`Nueva visita - ${paciente?.usuario?.nombre}`)
            .html(emailVisitaMedico({
              nombreMedico: `${medico?.usuario?.nombre} ${medico?.usuario?.apellido}`,
              nombrePaciente: `${paciente?.usuario?.nombre} ${paciente?.usuario?.apellido}`,
              emailPaciente: emailLimpioPaciente!,
              telefonoPaciente: telefono,
              direccionVisita:direccion,
              barrio: barrio?.nombre_barrio!,
              fechaVisita: fechaFormateada,
              horaVisita: horaFormateada,
              descripcion: descripcion
            }))
        })
      }

      return response.json({ msj: 'Visita creada', data: nueva })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisita({ response }: HttpContext) {
    try {
      const lista = await visitasService.listar()
      return response.json({ msj: lista })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisitaId({ params, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)
      const visita = await visitasService.listarId(id_visita)
      return response.json({ msj: visita })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async actualizarVisita({ params, request, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)

      const {
        fecha_visita,
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      } = request.body()

      const actualizado = await visitasService.actualizarVisita(id_visita, {
        fecha_visita: fecha_visita ? DateTime.fromISO(fecha_visita) : undefined, // 👈 solo convierte si viene
        descripcion,
        direccion,
        estado,
        telefono,
        paciente_id,
        medico_id,
        barrio_id,
      })

      return response.json({ msj: actualizado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async eliminarVisita({ params, response }: HttpContext) {
    try {
      const id_visita = Number(params.id_visita)
      const eliminado = await visitasService.eliminar(id_visita)
      return response.json({ msj: eliminado })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async contarVisitas({ response }: HttpContext) {
    try {
      const cantidad = await visitasService.conteo()
      return response.json({ msj: cantidad })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  async listarVisitasPaciente({ params, response }: HttpContext) {
    try {
      const paciente_id = Number(params.paciente_id)
      const visitas = await visitasService.listarPorPaciente(paciente_id)
      return response.json({ msj: visitas })
    } catch (error) {
      return response.json({ error: error.message })
    } 
  }


  async listarVisitasMedico({ params, response }: HttpContext) {
  try {
    const medico_id = Number(params.medico_id)
    const visitas = await visitasService.listarPorMedico(medico_id)
    return response.json({ msj: visitas })
  } catch (error) {
    return response.json({ error: error.message })
  }
}

}
