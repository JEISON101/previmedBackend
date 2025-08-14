import Route from "@adonisjs/core/services/router";
import ModuloXRolController from "#controllers/ModuloXRolController";

const modxrol = new ModuloXRolController()

Route.post('/modxrol',modxrol.crearModXrol )
Route.get('/modxrol', modxrol.listarModXrol)
Route.get('/modxrol/:id_modulo_x_rol', modxrol.listarModXrolId)
Route.put('/modxrol/:id_modulo_x_rol', modxrol.actualizarModxRol)
Route.delete('/modxrol/:id_modulo_x_rol', modxrol.eliminarModxRol)
Route.get('/conteomodxrol', modxrol.contarModxRol)