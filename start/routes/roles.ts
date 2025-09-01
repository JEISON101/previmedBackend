import Route from "@adonisjs/core/services/router";
import RolesController from "#controllers/RolesController";

const roles = new RolesController()
Route.post('/roles',roles.crearRol )
Route.get('/roles', roles.listarRol)
Route.get('/roles/:id_rol', roles.listarRolId)
Route.put('/roles/:id_rol', roles.actualizarRol)
Route.delete('/roles/:id_rol', roles.eliminarRol)
Route.get('/conteoroles', roles.contarRol)