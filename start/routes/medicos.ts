import router from '@adonisjs/core/services/router'

const MedicosController = () => import('#controllers/MedicosController')

// Rutas para médicos
router.group(() => {

  //Obtener médico por usuario_id
  router.get('/usuario/:usuario_id', [MedicosController, 'listarPorUsuario'])


  // médicos disponibles - debe ir antes de :id
  router.get('/disponibles', [MedicosController, 'disponibles'])
  
  // CRUD básico
  router.get('/', [MedicosController, 'readAll'])
  router.post('/', [MedicosController, 'create'])
  router.get('/:id', [MedicosController, 'readId'])
  router.put('/:id', [MedicosController, 'update'])
  router.delete('/:id', [MedicosController, 'delete'])
  
  // Ruta especial para cambiar disponibilidad (me la dio chat)
  router.patch('/:id/disponibilidad', [MedicosController, 'cambiarDisponibilidad'])
}).prefix('medicos')

export default router