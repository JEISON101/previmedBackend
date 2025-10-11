import router from '@adonisjs/core/services/router' 
  
  // Pacientes (titulares)
  router.post('/', '#controllers/PacientesController.create')
  router.get('/',  '#controllers/PacientesController.readAll')
  router.get('/titular', '#controllers/PacientesController.readByTitular')
  router.delete('/:id', '#controllers/PacientesController.delete') 

  // Beneficiarios (dependientes)
  router.get('/beneficiarios', '#controllers/PacientesController.readBeneficiarios')
  router.post('/beneficiarios', '#controllers/PacientesController.createBeneficiario')
  router.get('/beneficiarios/:id', '#controllers/PacientesController.readBeneficiarioById')
  router.put('/beneficiarios/:id', '#controllers/PacientesController.updateBeneficiario')
  router.delete('/beneficiarios/:id', '#controllers/PacientesController.deleteBeneficiario')