import NotificacionesController from "#controllers/NotificacionesController";
import router from "./medicos.js";

const notificaciones = new NotificacionesController();

router.post('/notificaciones/create', notificaciones.create)
router.delete('/notificaciones/delete/:id', notificaciones.deleteNotifi)
router.get('/notificaciones/medico/:idMedico', notificaciones.notifiMedi)
router.get('/notificaciones/admin/visitas', notificaciones.notifiAdminVisitas)
router.get('/notificaciones/admin/pagos', notificaciones.notifiAdminPagos)
router.patch('/notificacion/:idNot', notificaciones.notifiVista)