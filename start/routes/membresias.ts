import Route from '@adonisjs/core/services/router'
import MembresiasController from '#controllers/MembresiasController'

const controller = new MembresiasController()

Route.post('/membresias', controller.crear)
Route.get('/membresias', controller.listar)
Route.get('/membresias/:id', controller.obtenerPorId)
Route.put('/membresias/:id', controller.actualizar)
Route.delete('/membresias/:id', controller.eliminar)