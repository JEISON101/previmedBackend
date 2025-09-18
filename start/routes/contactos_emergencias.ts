import ContactosEmergenciaController from "#controllers/ContactosEmergenciasController"
import router from "@adonisjs/core/services/router"

const contactosController = new ContactosEmergenciaController()

router.group(() => {
  router.get('/read', contactosController.read.bind(contactosController))
  router.get('/read/:id', contactosController.readId.bind(contactosController))
  router.post('/register', contactosController.register.bind(contactosController))
  router.put('/update/:id', contactosController.update.bind(contactosController))
  router.delete('/delete/:id', contactosController.delete.bind(contactosController))
}).prefix('/contactosemergencia')
