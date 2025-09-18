import BeneficiosController from "#controllers/BeneficiosController"
import router from "@adonisjs/core/services/router"

const beneficioController = new BeneficiosController()

router.group(() => {
  router.get('/read', beneficioController.read.bind(beneficioController))
  router.get('/read/:id', beneficioController.readId.bind(beneficioController))
  router.post('/register', beneficioController.register.bind(beneficioController))
  router.put('/update/:id', beneficioController.update.bind(beneficioController))
  router.delete('/delete/:id', beneficioController.delete.bind(beneficioController))
}).prefix('/beneficios')
