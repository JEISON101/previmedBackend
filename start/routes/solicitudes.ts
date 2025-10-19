import Route from '@adonisjs/core/services/router'

Route.get('/solicitudes', 'SolicitudesController.readAll')
Route.get('/solicitudes/:id', 'SolicitudesController.readId')
Route.post('/solicitudes', 'SolicitudesController.create')
Route.put('/solicitudes/:id', 'SolicitudesController.update')
Route.delete('/solicitudes/:id', 'SolicitudesController.delete')
Route.patch('/solicitudes/:id/estado', 'SolicitudesController.cambiarEstado')
