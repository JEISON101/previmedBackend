import Notificacione from '#models/notificacione'
import { DataNotificaciones } from '../interfaces/notificaciones.js'
import db from '@adonisjs/lucid/services/db'

export default class NotificacionesServices {
  async create(data: DataNotificaciones) {
    return await Notificacione.create(data)
  }
  // Notificación para el medico
  async notifiMedi(id: number) {
    return await db.from('notificaciones as n').where('n.medico_id', id)
    .where('n.estado', false)
    .join('usuarios as u', 'u.id_usuario', 'n.paciente_id')
    .select(
      'n.*',
      'u.nombre as nombrePaciente',
      'u.apellido as apellidoPaciente'
    )
    .orderBy('n.created_at', 'desc')
  }
  async update(id:any){
    const notifiacion = await Notificacione.findOrFail(id)
    notifiacion.estado = true;
    await notifiacion.save()
    return notifiacion
  }
}
