import Route from "@adonisjs/core/services/router";
import PlanesController from "#controllers/PlanesController";

const planes = new PlanesController()
Route.post('/planes',planes.crearPlan )
Route.get('/planes', planes.listarPlanes)
Route.get('/planes/:id_plan', planes.listarPlanId)
Route.put('/planes/:id_plan', planes.actualizarPlan)
Route.delete('/planes/:id_plan', planes.eliminarPlan)
Route.get('/conteoplanes', planes.contarPlanes)
