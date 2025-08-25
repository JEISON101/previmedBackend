import Route from "@adonisjs/core/services/router";
import VisitasController from "#controllers/VisitasController";

const visitas = new VisitasController()

Route.post('/visitas', visitas.crearVisita)
Route.get('/visitas', visitas.listarVisita)
Route.get('/visitas/:id_visita', visitas.listarVisitaId)
Route.put('/visitas/:id_visita', visitas.actualizarVisita)
Route.delete('/visitas/:id_visita', visitas.eliminarVisita)
Route.get('/conteovisitas', visitas.contarVisitas)
