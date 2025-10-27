import MembresiaXPacienteController from "#controllers/MembresiaXPacientesController"
import router from "@adonisjs/core/services/router"

const controller = new MembresiaXPacienteController()

router.group(() => {
  router.get('/read', controller.read.bind(controller))
  router.get('/read/:id', controller.readId.bind(controller))
  router.post('/register', controller.register.bind(controller))
  router.put('/update/:id', controller.update.bind(controller))
  router.delete('/delete/:id', controller.delete.bind(controller))
  router.get('/user/:id', controller.getByUserId.bind(controller))
}).prefix('/membresiasxpacientes')
