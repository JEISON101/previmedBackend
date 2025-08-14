import UsuariosController from '#controllers/UsuariosController'
import router from '@adonisjs/core/services/router'

const usuariosController = new UsuariosController()

// Ruta de login independiente
router.post('/login', async (ctx) => {
  return usuariosController.login(ctx)
})

// CRUD Usuarios
router.group(() => {
  router.get('/', (ctx) => usuariosController.index(ctx))
  router.get('/:id', (ctx) => usuariosController.show(ctx))
  router.post('/', (ctx) => usuariosController.store(ctx))
  router.put('/:id', (ctx) => usuariosController.update(ctx))
  router.delete('/:id', (ctx) => usuariosController.destroy(ctx))
}).prefix('/usuarios')
