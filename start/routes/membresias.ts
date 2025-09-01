import Route from '@adonisjs/core/services/router'
import MembresiasController from '#controllers/MembresiasController'

Route.post('/membresias', [MembresiasController, 'crear'])
Route.get('/membresias', [MembresiasController, 'listar'])
Route.get('/membresias/:id', [MembresiasController, 'obtenerPorId'])
Route.put('/membresias/:id', [MembresiasController, 'actualizar'])
Route.delete('/membresias/:id', [MembresiasController, 'eliminar'])
