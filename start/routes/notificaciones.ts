import NotificacionesController from "#controllers/NotificacionesController";
import router from "./medicos.js";

const notificaciones = new NotificacionesController();

router.post('/notificaciones/create', notificaciones.create)
router.get('/notificaciones/medico/:idMedico', notificaciones.notifiMedi)
router.patch('/notificacion/:idNot', notificaciones.notifiVista)