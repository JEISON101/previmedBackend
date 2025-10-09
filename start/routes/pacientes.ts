import router from '@adonisjs/core/services/router'

router.post('/pacientes', '#controllers/PacientesController.create')
router.get('/pacientes', '#controllers/PacientesController.readAll')
router.get('/pacientes/titular', '#controllers/PacientesController.readByITitular')
router.get('/pacientes/beneficiarios', '#controllers/PacientesController.readBeneficiarios')
router.post('/pacientes/beneficiarios', '#controllers/PacientesController.createBeneficiario')
router.get('/pacientes/beneficiarios/:id', '#controllers/PacientesController.readBeneficiarioById')
router.put('/pacientes/beneficiarios/:id', '#controllers/PacientesController.updateBeneficiario')
router.delete('/pacientes/beneficiarios/:id', '#controllers/PacientesController.deleteBeneficiario')
router.get('/pacientes/:id', '#controllers/PacientesController.readById')
router.put('/pacientes/:id', '#controllers/PacientesController.updateById')
router.delete('/pacientes/:id', '#controllers/PacientesController.deleteById')
