import  Route  from "@adonisjs/core/services/router";
import BarriosController from "#controllers/BarriosController";

Route.post('/barrios',[BarriosController ,'crearBarrio'])
Route.get('/barrios', [BarriosController, 'listarBarrio'])
Route.get('/barrios/:id_barrio', [BarriosController,'listarBarrioId'])
Route.put('/barrios/:id_barrio', [BarriosController,'actualizarBarrio'])
Route.delete('/barrios/:id_barrio', [BarriosController,'eliminarBarrio'])