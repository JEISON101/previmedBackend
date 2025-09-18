import router from '@adonisjs/core/services/router'
const TelefonosController = () => import('#controllers/TelefonosController')

router
  .group(() => {

    //listar todos
    router.get('/read', [TelefonosController, 'readAll'])
    //listar por id de telefono
    router.get('/read/:id', [TelefonosController, 'readByIdTel'])
    //listar pot el id del usuario
    router.get('/usuario/:usuario_id', [TelefonosController, 'readByIdUser'])
    //registrar
    router.post('/register', [TelefonosController, 'register'])
    //para actualizar el params es el id del telefono, ojo
    router.put('/update/:id', [TelefonosController, 'update'])
    ////eliminar
    router.delete('/delete/:id', [TelefonosController, 'delete'])
  })
  .prefix('/telefonos')
