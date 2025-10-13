import router from '@adonisjs/core/services/router' 
  
   // Titulares
  router.post('/', '#controllers/PacientesController.create')
  router.get('/',  '#controllers/PacientesController.readAll')
  router.get('/titular', '#controllers/PacientesController.readByTitular')
  router.get('/beneficiarios', '#controllers/PacientesController.readBeneficiarios')
  router.post('/beneficiarios', '#controllers/PacientesController.createBeneficiario')
  router.post('/beneficiarios/asociar', '#controllers/PacientesController.asociarBeneficiario')
  router.post('/beneficiarios/desvincular', '#controllers/PacientesController.desvincularBeneficiario')
  router.get('/beneficiarios/:id/usuario', '#controllers/PacientesController.getUsuarioDeBeneficiario')
  router.patch('/:id/campos', '#controllers/PacientesController.updateCamposPaciente') // solo tabla pacientes
  router.delete('/:id', '#controllers/PacientesController.delete')
  router.get('/beneficiarios/:id', '#controllers/PacientesController.readBeneficiarioById')
  router.delete('/beneficiarios/:id', '#controllers/PacientesController.deleteBeneficiario')
